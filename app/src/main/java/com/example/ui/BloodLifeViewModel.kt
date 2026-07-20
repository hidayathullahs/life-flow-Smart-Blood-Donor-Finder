package com.example.ui

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.AppDatabase
import com.example.data.BloodLifeRepository
import com.example.data.BloodRequest
import com.example.data.Donor
import com.example.data.GeminiAssistant
import com.example.data.GeminiContent
import com.example.data.GeminiPart
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import kotlinx.coroutines.ExperimentalCoroutinesApi

data class ChatMessage(
    val id: String = java.util.UUID.randomUUID().toString(),
    val text: String,
    val isUser: Boolean,
    val timestamp: Long = System.currentTimeMillis()
)

@OptIn(ExperimentalCoroutinesApi::class)
class BloodLifeViewModel(application: Application) : AndroidViewModel(application) {

    private val db = AppDatabase.getDatabase(application, viewModelScope)
    private val repository = BloodLifeRepository(db)

    // All active blood requests
    val allRequests: StateFlow<List<BloodRequest>> = repository.allRequests
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    // Search Parameters
    private val _searchBloodType = MutableStateFlow("")
    val searchBloodType = _searchBloodType.asStateFlow()

    private val _searchCity = MutableStateFlow("")
    val searchCity = _searchCity.asStateFlow()

    // Search Results for Donors
    private val _searchTrigger = MutableStateFlow(Pair("", ""))
    val searchResults: StateFlow<List<Donor>> = _searchTrigger
        .flatMapLatest { (bloodType, city) ->
            repository.searchDonors(bloodType, city)
        }
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    // All donors (for general list when no search criteria)
    val allDonors: StateFlow<List<Donor>> = repository.allDonors
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    // AI Assistant state
    private val _aiMessages = MutableStateFlow<List<ChatMessage>>(
        listOf(
            ChatMessage(
                text = "Hello! I am your Smart Blood Life Assistant. Ask me anything about blood groups, compatibility, donation eligibility, or health tips!",
                isUser = false
            )
        )
    )
    val aiMessages = _aiMessages.asStateFlow()

    private val _isAiLoading = MutableStateFlow(false)
    val isAiLoading = _isAiLoading.asStateFlow()

    init {
        // Initially search for empty values (returns all available donors)
        triggerSearch("", "")
    }

    fun triggerSearch(bloodType: String, city: String) {
        _searchBloodType.value = bloodType
        _searchCity.value = city
        _searchTrigger.value = Pair(bloodType, city)
    }

    fun addBloodRequest(
        patientName: String,
        bloodType: String,
        hospitalName: String,
        city: String,
        contactPhone: String,
        unitsNeeded: Int,
        urgency: String,
        additionalNotes: String,
        onSuccess: () -> Unit
    ) {
        viewModelScope.launch {
            val request = BloodRequest(
                patientName = patientName,
                bloodType = bloodType,
                hospitalName = hospitalName,
                city = city,
                contactPhone = contactPhone,
                unitsNeeded = unitsNeeded,
                urgency = urgency,
                additionalNotes = additionalNotes
            )
            repository.insertRequest(request)
            onSuccess()
        }
    }

    fun registerAsDonor(
        name: String,
        bloodType: String,
        phone: String,
        email: String,
        city: String,
        lastDonationDate: String,
        onSuccess: () -> Unit
    ) {
        viewModelScope.launch {
            val donor = Donor(
                name = name,
                bloodType = bloodType,
                phone = phone,
                email = email,
                city = city,
                lastDonationDate = if (lastDonationDate.isEmpty()) "Never" else lastDonationDate,
                isAvailable = true
            )
            repository.insertDonor(donor)
            onSuccess()
        }
    }

    fun askAiAssistant(question: String) {
        if (question.isBlank()) return

        val userMessage = ChatMessage(text = question, isUser = true)
        _aiMessages.value = _aiMessages.value + userMessage
        _isAiLoading.value = true

        viewModelScope.launch {
            // Build Gemini context from the last 10 messages for continuous flow
            val history = _aiMessages.value.takeLast(10).dropLast(1).map {
                GeminiContent(
                    parts = listOf(GeminiPart(text = it.text))
                )
            }

            val responseText = GeminiAssistant.askAssistant(question, history)
            
            _aiMessages.value = _aiMessages.value + ChatMessage(text = responseText, isUser = false)
            _isAiLoading.value = false
        }
    }

    fun clearAiChat() {
        _aiMessages.value = listOf(
            ChatMessage(
                text = "Chat cleared! How else can I assist you with blood donation compatibility or guidelines today?",
                isUser = false
            )
        )
    }

    fun deleteBloodRequest(requestId: Int) {
        viewModelScope.launch {
            repository.deleteRequest(requestId)
        }
    }
}
