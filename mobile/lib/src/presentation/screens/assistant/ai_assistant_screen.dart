import 'package:flutter/material.dart';
import 'package:smart_blood_life/src/core/theme/app_theme.dart';
import 'package:smart_blood_life/src/data/repositories/ai_assistant_service.dart';

class AiAssistantScreen extends StatefulWidget {
  const AiAssistantScreen({super.key});

  @override
  State<AiAssistantScreen> createState() => _AiAssistantScreenState();
}

class _AiAssistantScreenState extends State<AiAssistantScreen> {
  final _controller = TextEditingController();
  final _aiService = AiAssistantService();
  final List<Map<String, dynamic>> _messages = [];
  bool _isTyping = false;

  final List<String> _suggestions = [
    'Need O+ in Chennai',
    'Donor eligibility check',
    'Diet tips before donation',
  ];

  @override
  void initState() {
    super.initState();
    _messages.add({
      'text': 'Hello! I am your Life Flow Health Assistant. Ask me about blood compatibility, donor eligibility, or type a request (e.g. "Need O+ in Chennai") to check nearby matches.',
      'isUser': false,
    });
  }

  void _sendMessage({String? customText}) async {
    final text = customText ?? _controller.text.trim();
    if (text.isEmpty) return;

    if (customText == null) {
      _controller.clear();
    }
    
    setState(() {
      _messages.add({'text': text, 'isUser': true});
      _isTyping = true;
    });

    try {
      final response = await _aiService.processQuery(text);
      setState(() {
        _messages.add({'text': response, 'isUser': false});
      });
    } catch (e) {
      setState(() {
        _messages.add({'text': 'Sorry, I couldn\'t process that request right now.', 'isUser': false});
      });
    } finally {
      setState(() => _isTyping = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('AI Health Companion'),
      ),
      body: Column(
        children: [
          // Message List Stream
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(20.0),
              itemCount: _messages.length + 1, // Add 1 for the welcome guide cards
              itemBuilder: (context, index) {
                if (index == 0) {
                  return _buildHeaderGuides(isDark);
                }
                
                final msg = _messages[index - 1];
                final isUser = msg['isUser'] as bool;
                return Align(
                  alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    constraints: BoxConstraints(
                      maxWidth: MediaQuery.of(context).size.width * 0.78,
                    ),
                    margin: const EdgeInsets.only(bottom: 16.0),
                    padding: const EdgeInsets.symmetric(horizontal: 18.0, vertical: 14.0),
                    decoration: BoxDecoration(
                      gradient: isUser 
                          ? const LinearGradient(
                              colors: [AppTheme.bloodRed, AppTheme.accentRed],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            )
                          : null,
                      color: isUser 
                          ? null 
                          : (isDark ? AppTheme.darkCard : Colors.white),
                      borderRadius: BorderRadius.only(
                        topLeft: const Radius.circular(20),
                        topRight: const Radius.circular(20),
                        bottomLeft: isUser ? const Radius.circular(20) : Radius.zero,
                        bottomRight: isUser ? Radius.zero : const Radius.circular(20),
                      ),
                      border: isUser 
                          ? null 
                          : Border.all(
                              color: isDark ? Colors.white.withValues(alpha: 0.05) : Colors.grey.shade100,
                              width: 1.5,
                            ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: isUser ? 0.1 : 0.02),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Text(
                      msg['text'] as String,
                      style: TextStyle(
                        color: isUser ? Colors.white : (isDark ? Colors.white.withValues(alpha: 0.9) : const Color(0xFF0F172A)),
                        fontSize: 15,
                        height: 1.4,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          
          if (_isTyping)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 20),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    color: isDark ? AppTheme.darkCard : Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: isDark ? Colors.white10 : Colors.grey.shade100),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const SizedBox(
                        width: 14,
                        height: 14,
                        child: CircularProgressIndicator(strokeWidth: 2, color: AppTheme.bloodRed),
                      ),
                      const SizedBox(width: 10),
                      Text(
                        'AI is scanning matching networks...',
                        style: TextStyle(fontSize: 12, color: isDark ? Colors.white60 : Colors.black54, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            
          // Suggestion Chips
          if (_messages.length == 1 && !_isTyping)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Padding(
                    padding: EdgeInsets.only(left: 4.0, bottom: 8.0),
                    child: Text(
                      'Suggested Queries',
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey),
                    ),
                  ),
                  SizedBox(
                    height: 38,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: _suggestions.length,
                      separatorBuilder: (c, i) => const SizedBox(width: 8),
                      itemBuilder: (context, index) {
                        final sugg = _suggestions[index];
                        return ActionChip(
                          label: Text(sugg, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                          backgroundColor: isDark ? AppTheme.darkCard : Colors.white,
                          side: BorderSide(color: isDark ? Colors.white10 : Colors.grey.shade200),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          onPressed: () => _sendMessage(customText: sugg),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
            
          // Input Box Area
          Container(
            padding: const EdgeInsets.all(16.0),
            decoration: BoxDecoration(
              color: isDark ? AppTheme.darkBg : Colors.white,
              border: Border(
                top: BorderSide(
                  color: isDark ? Colors.white.withValues(alpha: 0.05) : Colors.grey.shade100,
                  width: 1.5,
                ),
              ),
            ),
            child: SafeArea(
              child: Row(
                children: [
                  Expanded(
                    child: Container(
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF0F1E33) : const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(24),
                      ),
                      child: TextFormField(
                        controller: _controller,
                        style: const TextStyle(fontSize: 15),
                        decoration: const InputDecoration(
                          hintText: 'Ask AI Matcher...',
                          border: InputBorder.none,
                          enabledBorder: InputBorder.none,
                          focusedBorder: InputBorder.none,
                          contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          filled: false,
                        ),
                        onFieldSubmitted: (_) => _sendMessage(),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Container(
                    decoration: const BoxDecoration(
                      color: AppTheme.bloodRed,
                      shape: BoxShape.circle,
                    ),
                    child: IconButton(
                      icon: const Icon(Icons.arrow_upward, color: Colors.white, size: 20),
                      onPressed: () => _sendMessage(),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeaderGuides(bool isDark) {
    return Container(
      margin: const EdgeInsets.only(bottom: 24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Healthcare Resources',
            style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16, letterSpacing: -0.3),
          ),
          const SizedBox(height: 12),
          SizedBox(
            height: 120,
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: [
                _buildGuideCard(
                  isDark,
                  'Blood Compatibility',
                  'O- is universal donor. AB+ is universal recipient.',
                  Icons.compare_arrows_outlined,
                  AppTheme.secondaryBlue,
                ),
                _buildGuideCard(
                  isDark,
                  'Diet & Pre-Donation',
                  'Drink water, eat iron-rich foods, avoid fatty meals.',
                  Icons.restaurant_outlined,
                  AppTheme.successGreen,
                ),
                _buildGuideCard(
                  isDark,
                  'Post-Donation Recovery',
                  'Rest, stay hydrated, keep bandage on for a few hours.',
                  Icons.healing_outlined,
                  AppTheme.warningOrange,
                ),
              ],
            ),
          ),
          const Divider(height: 32),
        ],
      ),
    );
  }

  Widget _buildGuideCard(bool isDark, String title, String text, IconData icon, Color color) {
    return Container(
      width: 220,
      margin: const EdgeInsets.only(right: 14),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isDark ? AppTheme.darkCard : Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: isDark ? Colors.white.withValues(alpha: 0.05) : Colors.grey.shade100,
          width: 1.5,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            children: [
              Icon(icon, color: color, size: 18),
              const SizedBox(width: 8),
              Text(
                title,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            text,
            style: TextStyle(color: isDark ? Colors.white54 : Colors.black54, fontSize: 11, height: 1.3),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}
