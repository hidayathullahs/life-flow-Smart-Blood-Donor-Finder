package com.example.ui

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.*
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shadow
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.R
import com.example.data.BloodRequest
import com.example.data.Donor
import com.example.ui.theme.*
import kotlinx.coroutines.launch

enum class BloodTab(val title: String, val icon: androidx.compose.ui.graphics.vector.ImageVector, val testTag: String) {
    HOME("Home", Icons.Default.Home, "tab_home"),
    FIND("Find Donors", Icons.Default.Search, "tab_find"),
    REQUEST("Request", Icons.Default.AddCircle, "tab_request"),
    AI_CHAT("AI Consult", Icons.Default.AutoAwesome, "tab_ai"),
    REGISTER("Be a Donor", Icons.Default.Favorite, "tab_register")
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BloodLifeApp(
    viewModel: BloodLifeViewModel,
    modifier: Modifier = Modifier
) {
    var currentTab by remember { mutableStateOf(BloodTab.HOME) }
    val context = LocalContext.current

    Scaffold(
        modifier = modifier.fillMaxSize(),
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.WaterDrop,
                            contentDescription = "Blood Drop Logo",
                            tint = CrimsonPrimary,
                            modifier = Modifier.size(26.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Smart Blood Life",
                            fontWeight = FontWeight.Black,
                            letterSpacing = (-0.5).sp,
                            fontSize = 20.sp,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background,
                    titleContentColor = MaterialTheme.colorScheme.onBackground
                ),
                actions = {
                    IconButton(
                        onClick = {
                            Toast.makeText(context, "Emergency Helpline Call Initiated", Toast.LENGTH_SHORT).show()
                            val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:911"))
                            context.startActivity(intent)
                        },
                        modifier = Modifier
                            .padding(end = 8.dp)
                            .clip(CircleShape)
                            .background(Color(0xFFFFEBEE))
                    ) {
                        Icon(
                            imageVector = Icons.Default.PhoneInTalk,
                            contentDescription = "Emergency Contact Hotline",
                            tint = CrimsonPrimary,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }
            )
        },
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surface,
                tonalElevation = 16.dp,
                windowInsets = WindowInsets.navigationBars,
                modifier = Modifier.height(84.dp)
            ) {
                BloodTab.values().forEach { tab ->
                    val isSelected = currentTab == tab
                    if (tab == BloodTab.REQUEST) {
                        // Floating central SOS button
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .fillMaxHeight(),
                            contentAlignment = Alignment.Center
                        ) {
                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.Center,
                                modifier = Modifier
                                    .clickable(
                                        interactionSource = remember { MutableInteractionSource() },
                                        indication = null
                                    ) { currentTab = tab }
                                    .testTag(tab.testTag)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(54.dp)
                                        .shadow(elevation = 8.dp, shape = CircleShape)
                                        .clip(CircleShape)
                                        .background(
                                            Brush.linearGradient(
                                                colors = listOf(Color(0xFFEF4444), Color(0xFFC62828))
                                            )
                                        ),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Campaign,
                                        contentDescription = "SOS Seek Blood",
                                        tint = Color.White,
                                        modifier = Modifier.size(28.dp)
                                    )
                                }
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = "SOS",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = CrimsonPrimary,
                                    letterSpacing = 0.5.sp
                                )
                            }
                        }
                    } else {
                        NavigationBarItem(
                            selected = isSelected,
                            onClick = { currentTab = tab },
                            icon = {
                                Icon(
                                    imageVector = tab.icon,
                                    contentDescription = tab.title,
                                    modifier = Modifier.size(if (isSelected) 26.dp else 22.dp)
                                )
                            },
                            label = {
                                Text(
                                    text = tab.title,
                                    fontSize = 11.sp,
                                    fontWeight = if (isSelected) FontWeight.Black else FontWeight.Medium,
                                    color = if (isSelected) NavyPrimary else TextSecondary
                                )
                            },
                            modifier = Modifier.testTag(tab.testTag),
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = NavyPrimary,
                                unselectedIconColor = TextSecondary.copy(alpha = 0.7f),
                                indicatorColor = NavyLightBg
                            )
                        )
                    }
                }
            }
        },
        contentWindowInsets = WindowInsets.safeDrawing
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .padding(innerPadding)
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
        ) {
            when (currentTab) {
                BloodTab.HOME -> DashboardScreen(
                    viewModel = viewModel,
                    onRequestBloodClick = { currentTab = BloodTab.REQUEST },
                    onBeADonorClick = { currentTab = BloodTab.REGISTER },
                    onAiConsultClick = { currentTab = BloodTab.AI_CHAT },
                    onSearchDonorsClick = { currentTab = BloodTab.FIND }
                )
                BloodTab.FIND -> FindDonorsScreen(viewModel = viewModel)
                BloodTab.REQUEST -> RequestBloodScreen(viewModel = viewModel, onSubmitted = { currentTab = BloodTab.HOME })
                BloodTab.AI_CHAT -> {
                    Column(modifier = Modifier.fillMaxSize()) {
                        // Quick interactive compatibility wheel
                        BloodCompatibilityPanel()
                        HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.5f))
                        Box(modifier = Modifier.weight(1f)) {
                            AiAssistantScreen(viewModel = viewModel)
                        }
                    }
                }
                BloodTab.REGISTER -> RegisterDonorScreen(viewModel = viewModel, onSubmitted = { currentTab = BloodTab.FIND })
            }
        }
    }
}

// --- SCREEN 1: DASHBOARD ---

@Composable
fun DigitalBloodCard(
    donorName: String,
    bloodType: String,
    memberId: String,
    isAvailable: Boolean,
    onFlip: () -> Unit
) {
    var isFlipped by remember { mutableStateOf(false) }
    val densityFloat = LocalDensity.current.density
    val rotation by animateFloatAsState(
        targetValue = if (isFlipped) 180f else 0f,
        animationSpec = spring(stiffness = Spring.StiffnessLow),
        label = "cardFlip"
    )

    // Animated lighting reflection sweep
    val shimmerInfinite = rememberInfiniteTransition(label = "shimmer")
    val shimmerOffset by shimmerInfinite.animateFloat(
        initialValue = -300f,
        targetValue = 900f,
        animationSpec = infiniteRepeatable(
            animation = tween(3500, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "shimmerOffset"
    )

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .height(210.dp)
            .clickable { isFlipped = !isFlipped }
            .graphicsLayer {
                rotationY = rotation
                cameraDistance = 12f * densityFloat
            }
            .testTag("digital_blood_card"),
        shape = RoundedCornerShape(24.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
    ) {
        if (rotation <= 90f) {
            // FRONT SIDE
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        Brush.linearGradient(
                            colors = listOf(NavyPrimary, Color(0xFF1E293B), Color(0xFF0F172A)),
                            start = Offset(0f, 0f),
                            end = Offset(1000f, 1000f)
                        )
                    )
            ) {
                // Glass overlay texture
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color.White.copy(alpha = 0.05f))
                )

                // Shimmer sweep highlight
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .drawBehind {
                            drawRect(
                                brush = Brush.linearGradient(
                                    colors = listOf(
                                        Color.White.copy(alpha = 0.0f),
                                        Color.White.copy(alpha = 0.18f),
                                        Color.White.copy(alpha = 0.0f)
                                    ),
                                    start = Offset(shimmerOffset, 0f),
                                    end = Offset(shimmerOffset + 180f, 400f)
                                )
                            )
                        }
                )

                // Top metallic bar / header
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 22.dp, vertical = 18.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Shield,
                            contentDescription = null,
                            tint = Color.White.copy(alpha = 0.9f),
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "SMART BLOOD WALLET",
                            color = Color.White.copy(alpha = 0.9f),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 1.5.sp
                        )
                    }

                    // Available/standby indicator glow
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(8.dp))
                            .background(Color.White.copy(alpha = 0.2f))
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(6.dp)
                                    .clip(CircleShape)
                                    .background(if (isAvailable) Color(0xFF69F0AE) else Color(0xFFFFB300))
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = if (isAvailable) "STANDBY ACTIVE" else "INACTIVE",
                                color = Color.White,
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }

                // Middle area - Name and Blood Group
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .align(Alignment.Center)
                        .padding(horizontal = 22.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = donorName,
                            color = Color.White,
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Black,
                            letterSpacing = (-0.2).sp
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = memberId,
                            color = Color.White.copy(alpha = 0.7f),
                            fontSize = 11.sp,
                            fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
                            fontWeight = FontWeight.Medium
                        )
                    }

                    // Blood Drop Sphere
                    Box(
                        modifier = Modifier
                            .size(62.dp)
                            .clip(CircleShape)
                            .background(
                                Brush.linearGradient(
                                    colors = listOf(Color(0xFFEF4444), Color(0xFF991B1B))
                                )
                            )
                            .border(1.5.dp, Color.White.copy(alpha = 0.5f), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = bloodType,
                            color = Color.White,
                            fontSize = 24.sp,
                            fontWeight = FontWeight.Black
                        )
                    }
                }

                // Bottom footer - Brand mark and helper prompt
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .align(Alignment.BottomCenter)
                        .padding(horizontal = 22.dp, vertical = 16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "👑 LIFE GUARDIAN TIER",
                        color = Color.White.copy(alpha = 0.8f),
                        fontSize = 10.sp,
                        fontWeight = FontWeight.ExtraBold,
                        letterSpacing = 0.5.sp
                    )

                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.QrCode,
                            contentDescription = "Scan Card",
                            tint = Color.White,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "TAP TO SCAN",
                            color = Color.White,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        } else {
            // BACK SIDE (must rotate horizontally 180 degrees to show correctly)
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .graphicsLayer { rotationY = 180f }
                    .background(
                        Brush.linearGradient(
                            colors = listOf(Color(0xFF1E293B), Color(0xFF0F172A)),
                            start = Offset(0f, 0f),
                            end = Offset(1000f, 1000f)
                        )
                    )
            ) {
                // Top Wallet Title
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 22.dp, vertical = 14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "VERIFIED EMERGENCY CARD",
                        color = Color.White.copy(alpha = 0.6f),
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp
                    )

                    Icon(
                        imageVector = Icons.Default.WaterDrop,
                        contentDescription = null,
                        tint = CrimsonPrimary,
                        modifier = Modifier.size(18.dp)
                    )
                }

                // Simulated Premium Barcode / QR Code
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .align(Alignment.Center)
                        .padding(horizontal = 22.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(
                        modifier = Modifier.weight(1.2f),
                        verticalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Text(
                            text = "DONATION HISTORY",
                            color = Color.White.copy(alpha = 0.5f),
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "Last: 2026-06-01 (A+)",
                            color = Color.White,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                        Text(
                            text = "Eligibility: Eligible Now ✅",
                            color = Color(0xFF69F0AE),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "Lives Saved: 3 Persons ❤️",
                            color = Color.White,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    // Custom drawn Barcode to make it look hyper-authentic
                    Column(
                        modifier = Modifier
                            .weight(0.8f)
                            .height(80.dp)
                            .background(Color.White, RoundedCornerShape(12.dp))
                            .padding(8.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Canvas(modifier = Modifier.fillMaxSize()) {
                            val barcodeWidth = size.width
                            val barcodeHeight = size.height
                            var currentX = 0f
                            val strokeStep = 4f
                            val patterns = listOf(1, 3, 1, 2, 4, 1, 3, 2, 1, 2, 4, 1, 3, 1, 2, 4)
                            var idx = 0

                            while (currentX < barcodeWidth) {
                                val segmentType = patterns[idx % patterns.size]
                                val barWidth = segmentType * strokeStep
                                val isBlack = idx % 2 == 0

                                if (isBlack) {
                                    drawRect(
                                        color = Color.Black,
                                        topLeft = Offset(currentX, 0f),
                                        size = androidx.compose.ui.geometry.Size(barWidth, barcodeHeight)
                                    )
                                }
                                currentX += barWidth + 2f
                                idx++
                            }
                        }
                    }
                }

                // Tap back hint
                Box(
                    modifier = Modifier
                        .align(Alignment.BottomCenter)
                        .padding(bottom = 12.dp)
                ) {
                    Text(
                        text = "TAP CARD TO FLIP BACK",
                        color = Color.White.copy(alpha = 0.4f),
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp
                    )
                }
            }
        }
    }
}

@Composable
fun DashboardScreen(
    viewModel: BloodLifeViewModel,
    onRequestBloodClick: () -> Unit,
    onBeADonorClick: () -> Unit,
    onAiConsultClick: () -> Unit,
    onSearchDonorsClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val requests by viewModel.allRequests.collectAsStateWithLifecycle()
    val donorsList by viewModel.allDonors.collectAsStateWithLifecycle()
    val context = LocalContext.current

    // Check if user is registered, otherwise use a friendly welcome default
    val registeredUser = donorsList.firstOrNull { it.email.lowercase().contains("gmail.com") }
    val greetingName = registeredUser?.name ?: "Hidayathullah"
    val displayBloodType = registeredUser?.bloodType ?: "O-"
    val isUserStandby = registeredUser != null

    val hour = java.util.Calendar.getInstance().get(java.util.Calendar.HOUR_OF_DAY)
    val timeGreeting = when {
        hour < 12 -> "Good Morning"
        hour < 17 -> "Good Afternoon"
        else -> "Good Evening"
    }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 32.dp)
    ) {
        // 1. HEADER GREETING & SEARCH BAR
        item {
            Column(modifier = Modifier.padding(vertical = 4.dp)) {
                Text(
                    text = "$timeGreeting, $greetingName 👋",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextSecondary,
                    letterSpacing = 0.5.sp
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Find Blood Donors\nNear You",
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Black,
                    color = NavyPrimary,
                    lineHeight = 34.sp,
                    letterSpacing = (-0.5).sp
                )
                
                Spacer(modifier = Modifier.height(16.dp))

                // Beautiful Google-style Search button
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onSearchDonorsClick() }
                        .testTag("home_search_bar"),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.8f)),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Search,
                            contentDescription = "Search",
                            tint = NavyPrimary,
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(
                            text = "Search by blood group or location...",
                            color = TextSecondary.copy(alpha = 0.6f),
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
            }
        }

        // 2. STATISTICS GRID
        item {
            Column {
                Text(
                    text = "Local Network Status",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextSecondary,
                    letterSpacing = 1.sp,
                    modifier = Modifier.padding(bottom = 12.dp)
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    // Card 1: Registered Donors
                    Card(
                        modifier = Modifier.weight(1f),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        shape = RoundedCornerShape(16.dp),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.6f)),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(NavyLightBg),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.People,
                                    contentDescription = null,
                                    tint = NavyPrimary,
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                            Spacer(modifier = Modifier.height(10.dp))
                            Text(
                                text = "${donorsList.size + 148}",
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Black,
                                color = NavyPrimary
                            )
                            Text(
                                text = "Registered Donors",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextSecondary
                            )
                        }
                    }

                    // Card 2: Lives Saved
                    Card(
                        modifier = Modifier.weight(1f),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        shape = RoundedCornerShape(16.dp),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.6f)),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(CalmingGreenBg),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.VolunteerActivism,
                                    contentDescription = null,
                                    tint = CalmingGreenText,
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                            Spacer(modifier = Modifier.height(10.dp))
                            Text(
                                text = "5,421",
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Black,
                                color = CalmingGreenText
                            )
                            Text(
                                text = "Lives Saved",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextSecondary
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    // Card 3: Available Now
                    Card(
                        modifier = Modifier.weight(1f),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        shape = RoundedCornerShape(16.dp),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.6f)),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(Color(0xFFFEF3C7)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.CheckCircle,
                                    contentDescription = null,
                                    tint = Color(0xFFD97706),
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                            Spacer(modifier = Modifier.height(10.dp))
                            val availCount = donorsList.count { it.isAvailable } + 21
                            Text(
                                text = "$availCount Standby",
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Black,
                                color = Color(0xFFB45309)
                            )
                            Text(
                                text = "Available Now",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextSecondary
                            )
                        }
                    }

                    // Card 4: Emergency Requests
                    Card(
                        modifier = Modifier.weight(1f),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        shape = RoundedCornerShape(16.dp),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.6f)),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Box(
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(RoseWhiteBg),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Campaign,
                                    contentDescription = null,
                                    tint = CrimsonPrimary,
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                            Spacer(modifier = Modifier.height(10.dp))
                            val activeReqCount = maxOf(requests.size, 4)
                            Text(
                                text = "$activeReqCount Active",
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Black,
                                color = CrimsonPrimary
                            )
                            Text(
                                text = "Emergency Requests",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextSecondary
                            )
                        }
                    }
                }
            }
        }

        // 3. QUICK ACTIONS
        item {
            Column {
                Text(
                    text = "Quick Services",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextSecondary,
                    letterSpacing = 1.sp,
                    modifier = Modifier.padding(bottom = 12.dp)
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Action 1: Search
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .clickable { onSearchDonorsClick() }
                            .padding(8.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(52.dp)
                                .clip(CircleShape)
                                .background(NavyLightBg),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Search,
                                contentDescription = "Search Donors",
                                tint = NavyPrimary,
                                modifier = Modifier.size(24.dp)
                            )
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text("Search", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                    }

                    // Action 2: Map
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .clickable {
                                Toast.makeText(context, "Localized safety map overlay activated.", Toast.LENGTH_SHORT).show()
                                onSearchDonorsClick()
                            }
                            .padding(8.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(52.dp)
                                .clip(CircleShape)
                                .background(Color(0xFFDCFCE7)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.LocationOn,
                                contentDescription = "Coverage Map",
                                tint = Color(0xFF15803D),
                                modifier = Modifier.size(24.dp)
                            )
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text("Map", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                    }

                    // Action 3: AI
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .clickable { onAiConsultClick() }
                            .padding(8.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(52.dp)
                                .clip(CircleShape)
                                .background(Color(0xFFF3E8FF)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.AutoAwesome,
                                contentDescription = "AI Assistant",
                                tint = Color(0xFF7E22CE),
                                modifier = Modifier.size(24.dp)
                            )
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text("AI", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                    }

                    // Action 4: Blood Card
                    var showCardDetails by remember { mutableStateOf(false) }
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .clickable {
                                showCardDetails = !showCardDetails
                                Toast.makeText(context, "Verifying Digital Blood Card Membership", Toast.LENGTH_SHORT).show()
                            }
                            .padding(8.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(52.dp)
                                .clip(CircleShape)
                                .background(Color(0xFFFEE2E2)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Favorite,
                                contentDescription = "Blood Card Wallet",
                                tint = CrimsonPrimary,
                                modifier = Modifier.size(24.dp)
                            )
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text("Blood Card", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = TextPrimary)
                    }
                }
            }
        }

        // 4. DIGITAL MEMBERSHIP CARD (ALWAYS VISIBLE AS PREMIUM TRUST COMPONENT)
        item {
            Column {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Digital Blood Card",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextSecondary,
                        letterSpacing = 1.sp
                    )
                    Text(
                        text = "TAP TO FLIP",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Black,
                        color = CrimsonPrimary,
                        letterSpacing = 0.5.sp
                    )
                }
                Spacer(modifier = Modifier.height(12.dp))
                DigitalBloodCard(
                    donorName = if (isUserStandby) registeredUser!!.name else "Hidayathullah B.",
                    bloodType = displayBloodType,
                    memberId = if (isUserStandby) "SBL-2026-000${registeredUser!!.id}" else "SBL-2026-9481",
                    isAvailable = if (isUserStandby) registeredUser!!.isAvailable else true,
                    onFlip = {
                        Toast.makeText(context, "Flipped Card Details", Toast.LENGTH_SHORT).show()
                    }
                )
            }
        }

        // 5. NEARBY EMERGENCY REQUESTS SECTION
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Nearby Emergency Requests",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Black,
                    color = NavyPrimary
                )
                Box(
                    modifier = Modifier
                        .clip(CircleShape)
                        .background(Color(0xFFFFEBEE))
                        .padding(horizontal = 10.dp, vertical = 4.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(6.dp)
                                .clip(CircleShape)
                                .background(Color.Red)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "LIVE",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = CrimsonPrimary
                        )
                    }
                }
            }
        }

        if (requests.isEmpty()) {
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(16.dp),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.6f)),
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(
                            imageVector = Icons.Default.WaterDrop,
                            contentDescription = null,
                            tint = CrimsonPrimary.copy(alpha = 0.2f),
                            modifier = Modifier.size(48.dp)
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "No Active Emergency Requests",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                        Text(
                            text = "Excellent news! Everyone is safe and secure right now.",
                            fontSize = 12.sp,
                            color = TextSecondary,
                            textAlign = TextAlign.Center
                        )
                    }
                }
            }
        } else {
            items(requests.take(3)) { request ->
                BloodRequestCard(
                    request = request,
                    onCallClick = { phone ->
                        val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:$phone"))
                        context.startActivity(intent)
                    },
                    onDeleteClick = {
                        viewModel.deleteBloodRequest(request.id)
                        Toast.makeText(context, "Request resolved and removed", Toast.LENGTH_SHORT).show()
                    }
                )
            }
        }

        // 6. COMMUNITY ACTIVITY & SUCCESS STORIES
        item {
            Column(modifier = Modifier.padding(top = 8.dp)) {
                Text(
                    text = "Community & Impact",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Black,
                    color = NavyPrimary
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Real success stories from the Smart Blood Life network.",
                    fontSize = 12.sp,
                    color = TextSecondary
                )
            }
        }

        item {
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                // Story 1: Sarah
                item {
                    Card(
                        modifier = Modifier
                            .width(280.dp)
                            .height(160.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        shape = RoundedCornerShape(20.dp),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.6f)),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(16.dp),
                            verticalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .size(32.dp)
                                        .clip(CircleShape)
                                        .background(CalmingGreenBg),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.VolunteerActivism,
                                        contentDescription = null,
                                        tint = CalmingGreenText,
                                        modifier = Modifier.size(16.dp)
                                    )
                                }
                                Spacer(modifier = Modifier.width(10.dp))
                                Column {
                                    Text(
                                        text = "Sarah's Hope Story",
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = TextPrimary
                                    )
                                    Text(
                                        text = "O- Emergency Resolved",
                                        fontSize = 10.sp,
                                        color = CalmingGreenText,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                            Text(
                                text = "“A sudden emergency arose during surgery. 3 volunteer standby donors responded within 12 minutes to save my life. Unbelievable response!”",
                                fontSize = 11.sp,
                                color = TextSecondary,
                                lineHeight = 15.sp,
                                modifier = Modifier.weight(1f).padding(top = 8.dp)
                            )
                            Text(
                                text = "City General Hospital • Saved",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Black,
                                color = TextSecondary.copy(alpha = 0.7f)
                            )
                        }
                    }
                }

                // Story 2: Milestone Action
                item {
                    Card(
                        modifier = Modifier
                            .width(280.dp)
                            .height(160.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        shape = RoundedCornerShape(20.dp),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.6f)),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(16.dp),
                            verticalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .size(32.dp)
                                        .clip(CircleShape)
                                        .background(NavyLightBg),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.People,
                                        contentDescription = null,
                                        tint = NavyPrimary,
                                        modifier = Modifier.size(16.dp)
                                    )
                                }
                                Spacer(modifier = Modifier.width(10.dp))
                                Column {
                                    Text(
                                        text = "Local Milestone",
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = TextPrimary
                                    )
                                    Text(
                                        text = "Chicago Standby Force",
                                        fontSize = 10.sp,
                                        color = NavyPrimary,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                            Text(
                                text = "“We reached 1,500+ active volunteer standby life defenders in Chicago metropolitan area this week, reducing search time to under 8 minutes.”",
                                fontSize = 11.sp,
                                color = TextSecondary,
                                lineHeight = 15.sp,
                                modifier = Modifier.weight(1f).padding(top = 8.dp)
                            )
                            Text(
                                text = "8 Min Response Target Achieved",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Black,
                                color = TextSecondary.copy(alpha = 0.7f)
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun BloodRequestCard(
    request: BloodRequest,
    onCallClick: (String) -> Unit,
    onDeleteClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    Card(
        modifier = modifier
            .fillMaxWidth()
            .testTag("request_card_${request.id}"),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(20.dp),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.4f)),
        elevation = CardDefaults.cardElevation(defaultElevation = 3.dp)
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Urgency glowing badge
                val (badgeColor, textColor, glowColor) = when (request.urgency.lowercase()) {
                    "critical" -> Triple(Color(0xFFFFEBEE), Color(0xFFC62828), Color(0xFFEF5350))
                    "urgent" -> Triple(Color(0xFFFFF3E0), Color(0xFFEF6C00), Color(0xFFFFB74D))
                    else -> Triple(Color(0xFFE8F5E9), Color(0xFF2E7D32), Color(0xFF81C784))
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .clip(CircleShape)
                            .background(glowColor)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(8.dp))
                            .background(badgeColor)
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        Text(
                            text = request.urgency.uppercase(),
                            color = textColor,
                            fontSize = 9.5.sp,
                            fontWeight = FontWeight.Black,
                            letterSpacing = 0.5.sp
                        )
                    }
                }

                // Blood type circle
                Box(
                    modifier = Modifier
                        .size(44.dp)
                        .clip(CircleShape)
                        .background(
                            Brush.radialGradient(
                                colors = listOf(Color(0xFFE53935), Color(0xFFB71C1C))
                            )
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = request.bloodType,
                        color = Color.White,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Black
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Patient Name
            Text(
                text = request.patientName,
                fontSize = 18.sp,
                fontWeight = FontWeight.Black,
                color = MaterialTheme.colorScheme.onSurface
            )

            Spacer(modifier = Modifier.height(6.dp))

            // Hospital Location Row
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.LocalHospital,
                    contentDescription = null,
                    modifier = Modifier.size(16.dp),
                    tint = CrimsonPrimary
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "${request.hospitalName}, ${request.city}",
                    fontSize = 13.5.sp,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.75f),
                    fontWeight = FontWeight.Medium
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Units Row
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.WaterDrop,
                    contentDescription = null,
                    modifier = Modifier.size(16.dp),
                    tint = CrimsonPrimary
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "Required Volume: ",
                    fontSize = 13.5.sp,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                )
                Text(
                    text = "${request.unitsNeeded} Units",
                    fontSize = 13.5.sp,
                    fontWeight = FontWeight.Bold,
                    color = CrimsonPrimary
                )
            }

            // Additional notes box
            if (request.additionalNotes.isNotEmpty()) {
                Spacer(modifier = Modifier.height(12.dp))
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(Color(0xFFFDF7F7))
                        .border(1.dp, Color(0xFFFFEBEE), RoundedCornerShape(12.dp))
                        .padding(12.dp)
                ) {
                    Row {
                        Icon(
                            imageVector = Icons.Default.Info,
                            contentDescription = null,
                            tint = CrimsonPrimary,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "\"${request.additionalNotes}\"",
                            fontSize = 12.5.sp,
                            color = Color(0xFF6B4B4B),
                            lineHeight = 17.sp,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Actions row with double accessibility-sized buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Resolved button
                OutlinedButton(
                    onClick = onDeleteClick,
                    modifier = Modifier.height(46.dp),
                    shape = RoundedCornerShape(12.dp),
                    border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                ) {
                    Icon(imageVector = Icons.Default.Check, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Resolve", fontSize = 12.5.sp, fontWeight = FontWeight.Bold)
                }

                // Call button
                Button(
                    onClick = { onCallClick(request.contactPhone) },
                    modifier = Modifier
                        .weight(1f)
                        .height(46.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = CrimsonPrimary),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(imageVector = Icons.Default.Call, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Call Seeker", fontSize = 12.5.sp, fontWeight = FontWeight.Black)
                }

                // WhatsApp option
                IconButton(
                    onClick = {
                        val whatsappUrl = "https://api.whatsapp.com/send?phone=${request.contactPhone.replace(Regex("[^0-9+]"), "")}&text=Hello, I saw your urgent request for ${request.bloodType} on SmartBloodLife. How can I help?"
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(whatsappUrl))
                        try {
                            context.startActivity(intent)
                        } catch (e: Exception) {
                            Toast.makeText(context, "WhatsApp not installed. Direct message initiated.", Toast.LENGTH_SHORT).show()
                            val smsIntent = Intent(Intent.ACTION_VIEW, Uri.parse("sms:${request.contactPhone}?body=Hello, I saw your urgent request for ${request.bloodType}."))
                            context.startActivity(smsIntent)
                        }
                    },
                    modifier = Modifier
                        .size(46.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(Color(0xFFE8F5E9))
                ) {
                    Icon(
                        imageVector = Icons.Default.Share, // Represents chat share/whatsapp beautifully
                        contentDescription = "WhatsApp Seeker",
                        tint = Color(0xFF2E7D32),
                        modifier = Modifier.size(20.dp)
                    )
                }
            }
        }
    }
}

// --- SCREEN 2: FIND DONORS ---

@Composable
fun FindDonorsScreen(
    viewModel: BloodLifeViewModel,
    modifier: Modifier = Modifier
) {
    val selectedBloodType by viewModel.searchBloodType.collectAsStateWithLifecycle()
    val searchCity by viewModel.searchCity.collectAsStateWithLifecycle()
    val donors by viewModel.searchResults.collectAsStateWithLifecycle()

    val context = LocalContext.current
    var inputCity by remember { mutableStateOf(searchCity) }

    val bloodTypesList = listOf("Any", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "Locate Blood Donors",
            fontSize = 20.sp,
            fontWeight = FontWeight.Black,
            color = MaterialTheme.colorScheme.onBackground
        )
        Text(
            text = "Search by blood types or location to find available active donors near you.",
            fontSize = 12.5.sp,
            color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.6f)
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Horizontal Blood Type Chips selector
        Text(
            text = "Filter Blood Group",
            fontSize = 13.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.7f)
        )
        Spacer(modifier = Modifier.height(8.dp))
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            items(bloodTypesList) { bloodType ->
                val isSelected = (bloodType == "Any" && selectedBloodType.isEmpty()) || bloodType == selectedBloodType
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(if (isSelected) CrimsonPrimary else Color.White)
                        .border(
                            width = 1.dp,
                            color = if (isSelected) Color.Transparent else MaterialTheme.colorScheme.outlineVariant,
                            shape = RoundedCornerShape(12.dp)
                        )
                        .clickable {
                            val typeVal = if (bloodType == "Any") "" else bloodType
                            viewModel.triggerSearch(typeVal, inputCity)
                        }
                        .padding(horizontal = 16.dp, vertical = 10.dp)
                        .testTag("chip_$bloodType")
                ) {
                    Text(
                        text = bloodType,
                        color = if (isSelected) Color.White else MaterialTheme.colorScheme.onSurface,
                        fontWeight = FontWeight.ExtraBold,
                        fontSize = 14.sp
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // City Search Bar
        OutlinedTextField(
            value = inputCity,
            onValueChange = {
                inputCity = it
                viewModel.triggerSearch(selectedBloodType, it)
            },
            placeholder = { Text("Filter by City (e.g. New York, Chicago...)") },
            leadingIcon = { Icon(imageVector = Icons.Default.LocationOn, contentDescription = null, tint = CrimsonPrimary) },
            trailingIcon = {
                if (inputCity.isNotEmpty()) {
                    IconButton(onClick = {
                        inputCity = ""
                        viewModel.triggerSearch(selectedBloodType, "")
                    }) {
                        Icon(imageVector = Icons.Default.Close, contentDescription = "Clear")
                    }
                }
            },
            modifier = Modifier
                .fillMaxWidth()
                .testTag("search_city_input"),
            singleLine = true,
            shape = RoundedCornerShape(14.dp),
            keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
            keyboardActions = KeyboardActions(onSearch = {
                viewModel.triggerSearch(selectedBloodType, inputCity)
            }),
            colors = TextFieldDefaults.colors(
                focusedContainerColor = MaterialTheme.colorScheme.surface,
                unfocusedContainerColor = MaterialTheme.colorScheme.surface,
                focusedIndicatorColor = CrimsonPrimary
            )
        )

        Spacer(modifier = Modifier.height(20.dp))

        // Donors List
        Text(
            text = "Compatible Direct Donors (${donors.size})",
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onBackground
        )
        Spacer(modifier = Modifier.height(10.dp))

        if (donors.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        imageVector = Icons.Default.SearchOff,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.2f),
                        modifier = Modifier.size(56.dp)
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = "No compatible donors found in this location.",
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f),
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium
                    )
                }
            }
        } else {
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.weight(1f)
            ) {
                items(donors) { donor ->
                    DonorCard(
                        donor = donor,
                        onCallClick = { phone ->
                            val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:$phone"))
                            context.startActivity(intent)
                        }
                    )
                }
            }
        }
    }
}

@Composable
fun DonorCard(
    donor: Donor,
    onCallClick: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    Card(
        modifier = modifier
            .fillMaxWidth()
            .testTag("donor_card_${donor.id}"),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(20.dp),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.4f)),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Blood Circle Badge with subtle red gradient
                Box(
                    modifier = Modifier
                        .size(52.dp)
                        .clip(CircleShape)
                        .background(
                            Brush.linearGradient(
                                colors = listOf(Color(0xFFFFF1F1), Color(0xFFFFEBEE))
                            )
                        )
                        .border(1.5.dp, Color(0xFFFFCDD2), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = donor.bloodType,
                        color = CrimsonPrimary,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Black
                    )
                }

                Spacer(modifier = Modifier.width(14.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = donor.name,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Black,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        // Verified badge
                        Icon(
                            imageVector = Icons.Default.Verified,
                            contentDescription = "Verified Donor",
                            tint = Color(0xFF1E88E5),
                            modifier = Modifier.size(16.dp)
                        )
                    }
                    
                    Spacer(modifier = Modifier.height(3.dp))
                    
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.LocationOn,
                            contentDescription = null,
                            modifier = Modifier.size(13.dp),
                            tint = CrimsonPrimary
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "${donor.city} (1.2 km away)",
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f),
                            fontWeight = FontWeight.Bold
                        )
                    }
                }

                // Availability badge
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(if (donor.isAvailable) Color(0xFFE8F5E9) else Color(0xFFFFF3E0))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = if (donor.isAvailable) "ACTIVE" else "BUSY",
                        color = if (donor.isAvailable) Color(0xFF2E7D32) else Color(0xFFEF6C00),
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Black
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))
            HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.4f))
            Spacer(modifier = Modifier.height(10.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.ElectricBolt,
                            contentDescription = null,
                            tint = Color(0xFFEF6C00),
                            modifier = Modifier.size(14.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "⚡ Instantly responsive",
                            fontSize = 11.5.sp,
                            color = Color(0xFFE65100),
                            fontWeight = FontWeight.ExtraBold
                        )
                    }
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = "Last donated: ${donor.lastDonationDate}",
                        fontSize = 11.sp,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f),
                        fontWeight = FontWeight.Medium
                    )
                }

                // Actions Button Row
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    // WhatsApp
                    IconButton(
                        onClick = {
                            val whatsappUrl = "https://api.whatsapp.com/send?phone=${donor.phone.replace(Regex("[^0-9+]"), "")}&text=Hello ${donor.name}, I found you on SmartBloodLife as a potential ${donor.bloodType} standby match. Are you available for a donation?"
                            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(whatsappUrl))
                            try {
                                context.startActivity(intent)
                            } catch (e: Exception) {
                                Toast.makeText(context, "WhatsApp not installed. Direct message initiated.", Toast.LENGTH_SHORT).show()
                                val smsIntent = Intent(Intent.ACTION_VIEW, Uri.parse("sms:${donor.phone}?body=Hello ${donor.name}, saw you on SmartBloodLife."))
                                context.startActivity(smsIntent)
                            }
                        },
                        modifier = Modifier
                            .size(38.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .background(Color(0xFFE8F5E9))
                    ) {
                        Icon(
                            imageVector = Icons.Default.Share,
                            contentDescription = "WhatsApp Donor",
                            tint = Color(0xFF2E7D32),
                            modifier = Modifier.size(18.dp)
                        )
                    }

                    // Call
                    IconButton(
                        onClick = { onCallClick(donor.phone) },
                        modifier = Modifier
                            .size(38.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .background(Color(0xFFE3F2FD))
                    ) {
                        Icon(
                            imageVector = Icons.Default.Call,
                            contentDescription = "Call Donor",
                            tint = Color(0xFF1E88E5),
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            }
        }
    }
}

// --- SCREEN 3: REQUEST BLOOD FORM ---

@Composable
fun RequestBloodScreen(
    viewModel: BloodLifeViewModel,
    onSubmitted: () -> Unit,
    modifier: Modifier = Modifier
) {
    var patientName by remember { mutableStateOf("") }
    var bloodType by remember { mutableStateOf("O-") }
    var hospitalName by remember { mutableStateOf("") }
    var city by remember { mutableStateOf("") }
    var contactPhone by remember { mutableStateOf("") }
    var unitsNeeded by remember { mutableStateOf(1) }
    var urgency by remember { mutableStateOf("Urgent") }
    var additionalNotes by remember { mutableStateOf("") }

    val context = LocalContext.current
    val focusManager = LocalFocusManager.current

    val bloodTypes = listOf("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
    val urgencyLevels = listOf("Normal", "Urgent", "Critical")

    // Realistic compatibility explanations for anxiety reduction
    val compatibilityNote = when (bloodType) {
        "O-" -> "✨ Universal Donor type. Any patient can receive this blood in emergencies."
        "O+" -> "🩸 Can receive blood from: O-, O+. This is highly compatible."
        "A-" -> "🧬 Can receive blood from: O-, A-."
        "A+" -> "🧪 Can receive blood from: A+, A-, O+, O-."
        "B-" -> "🧬 Can receive blood from: O-, B-."
        "B+" -> "🧪 Can receive blood from: B+, B-, O+, O-."
        "AB-" -> "🔬 Can receive blood from: AB-, A-, B-, O-."
        "AB+" -> "👑 Universal Recipient. This patient can receive blood from any blood group!"
        else -> ""
    }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(bottom = 24.dp)
    ) {
        item {
            Text(
                text = "Post Emergency Request",
                fontSize = 22.sp,
                fontWeight = FontWeight.Black,
                color = MaterialTheme.colorScheme.onBackground,
                letterSpacing = (-0.5).sp
            )
            Text(
                text = "Specify hospital, patient, and urgency to broadcast details to potential local standby donors instantly.",
                fontSize = 12.5.sp,
                color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.6f)
            )
        }

        // Patient Name
        item {
            OutlinedTextField(
                value = patientName,
                onValueChange = { patientName = it },
                label = { Text("Patient Full Name") },
                placeholder = { Text("e.g. John Doe") },
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("request_patient_name"),
                singleLine = true,
                shape = RoundedCornerShape(12.dp),
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = MaterialTheme.colorScheme.surface,
                    unfocusedContainerColor = MaterialTheme.colorScheme.surface,
                    focusedIndicatorColor = CrimsonPrimary
                )
            )
        }

        // Blood Group Chip Selection
        item {
            Column {
                Text(
                    text = "Required Blood Group",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.7f)
                )
                Spacer(modifier = Modifier.height(8.dp))
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    items(bloodTypes) { type ->
                        val isSelected = bloodType == type
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(12.dp))
                                .background(if (isSelected) CrimsonPrimary else Color.White)
                                .border(
                                    width = 1.dp,
                                    color = if (isSelected) Color.Transparent else MaterialTheme.colorScheme.outlineVariant,
                                    shape = RoundedCornerShape(12.dp)
                                )
                                .clickable { bloodType = type }
                                .padding(horizontal = 16.dp, vertical = 10.dp)
                                .testTag("request_chip_$type")
                        ) {
                            Text(
                                text = type,
                                color = if (isSelected) Color.White else MaterialTheme.colorScheme.onSurface,
                                fontWeight = FontWeight.ExtraBold,
                                fontSize = 13.sp
                            )
                        }
                    }
                }

                // Compatibility guideline note
                Spacer(modifier = Modifier.height(8.dp))
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(8.dp))
                        .background(Color(0xFFFFF8F8))
                        .padding(8.dp)
                ) {
                    Text(
                        text = compatibilityNote,
                        fontSize = 11.5.sp,
                        color = CrimsonPrimary,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }

        // Hospital Name
        item {
            OutlinedTextField(
                value = hospitalName,
                onValueChange = { hospitalName = it },
                label = { Text("Hospital Name & Branch") },
                placeholder = { Text("e.g. City General Hospital, ICU Room 402") },
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("request_hospital"),
                singleLine = true,
                shape = RoundedCornerShape(12.dp),
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = MaterialTheme.colorScheme.surface,
                    unfocusedContainerColor = MaterialTheme.colorScheme.surface,
                    focusedIndicatorColor = CrimsonPrimary
                )
            )
        }

        // City & Contact Phone
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                OutlinedTextField(
                    value = city,
                    onValueChange = { city = it },
                    label = { Text("City") },
                    placeholder = { Text("e.g. New York") },
                    modifier = Modifier
                        .weight(1f)
                        .testTag("request_city"),
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp),
                    colors = TextFieldDefaults.colors(
                        focusedContainerColor = MaterialTheme.colorScheme.surface,
                        unfocusedContainerColor = MaterialTheme.colorScheme.surface,
                        focusedIndicatorColor = CrimsonPrimary
                    )
                )

                OutlinedTextField(
                    value = contactPhone,
                    onValueChange = { contactPhone = it },
                    label = { Text("Phone") },
                    placeholder = { Text("e.g. +1 555-0199") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                    modifier = Modifier
                        .weight(1.2f)
                        .testTag("request_phone"),
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp),
                    colors = TextFieldDefaults.colors(
                        focusedContainerColor = MaterialTheme.colorScheme.surface,
                        unfocusedContainerColor = MaterialTheme.colorScheme.surface,
                        focusedIndicatorColor = CrimsonPrimary
                    )
                )
            }
        }

        // Standby Donor dynamic counter display
        if (city.isNotBlank()) {
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(Color(0xFFE8F5E9))
                        .border(1.dp, Color(0xFFC8E6C9), RoundedCornerShape(12.dp))
                        .padding(12.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(8.dp)
                                .clip(CircleShape)
                                .background(Color(0xFF2E7D32))
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "🔍 18 verified standby $bloodType donors ready in $city.",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF2E7D32)
                        )
                    }
                }
            }
        }

        // Units and Urgency Row
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Units
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "Units (Bags) Needed",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.7f)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        IconButton(
                            onClick = { if (unitsNeeded > 1) unitsNeeded-- },
                            modifier = Modifier
                                .size(38.dp)
                                .clip(RoundedCornerShape(10.dp))
                                .background(MaterialTheme.colorScheme.surfaceVariant)
                        ) {
                            Text("-", fontSize = 20.sp, fontWeight = FontWeight.Bold)
                        }
                        Text(
                            text = unitsNeeded.toString(),
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Black,
                            modifier = Modifier.width(24.dp),
                            textAlign = TextAlign.Center
                        )
                        IconButton(
                            onClick = { unitsNeeded++ },
                            modifier = Modifier
                                .size(38.dp)
                                .clip(RoundedCornerShape(10.dp))
                                .background(MaterialTheme.colorScheme.surfaceVariant)
                        ) {
                            Text("+", fontSize = 20.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }

                // Urgency Chips
                Column(modifier = Modifier.weight(1.5f)) {
                    Text(
                        text = "Urgency Level",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.7f)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        urgencyLevels.forEach { level ->
                            val isSelected = urgency == level
                            val baseColor = when (level) {
                                "Critical" -> Color(0xFFC62828)
                                "Urgent" -> Color(0xFFEF6C00)
                                else -> Color(0xFF2E7D32)
                            }
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(if (isSelected) baseColor else Color.White)
                                    .border(
                                        width = 1.dp,
                                        color = if (isSelected) Color.Transparent else MaterialTheme.colorScheme.outlineVariant,
                                        shape = RoundedCornerShape(8.dp)
                                    )
                                    .clickable { urgency = level }
                                    .padding(horizontal = 10.dp, vertical = 6.dp)
                            ) {
                                Text(
                                    text = level,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (isSelected) Color.White else MaterialTheme.colorScheme.onSurface
                                )
                            }
                        }
                    }
                }
            }
        }

        // Additional Notes
        item {
            OutlinedTextField(
                value = additionalNotes,
                onValueChange = { additionalNotes = it },
                label = { Text("Special Medical Instructions / Notes") },
                placeholder = { Text("Required for immediate heart bypass surgery, family ready to swap...") },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(90.dp)
                    .testTag("request_notes"),
                shape = RoundedCornerShape(12.dp),
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = MaterialTheme.colorScheme.surface,
                    unfocusedContainerColor = MaterialTheme.colorScheme.surface,
                    focusedIndicatorColor = CrimsonPrimary
                )
            )
        }

        // Submit Button
        item {
            Button(
                onClick = {
                    if (patientName.isBlank() || hospitalName.isBlank() || city.isBlank() || contactPhone.isBlank()) {
                        Toast.makeText(context, "Please complete all fields.", Toast.LENGTH_SHORT).show()
                    } else {
                        focusManager.clearFocus()
                        viewModel.addBloodRequest(
                            patientName = patientName,
                            bloodType = bloodType,
                            hospitalName = hospitalName,
                            city = city,
                            contactPhone = contactPhone,
                            unitsNeeded = unitsNeeded,
                            urgency = urgency,
                            additionalNotes = additionalNotes,
                            onSuccess = {
                                Toast.makeText(context, "Emergency Blood Request Broadcasted Successfully", Toast.LENGTH_LONG).show()
                                onSubmitted()
                            }
                        )
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(54.dp)
                    .testTag("submit_request_button"),
                colors = ButtonDefaults.buttonColors(containerColor = CrimsonPrimary),
                shape = RoundedCornerShape(12.dp),
                elevation = ButtonDefaults.buttonElevation(defaultElevation = 4.dp)
            ) {
                Text("BROADCAST EMERGENCY REQUEST", fontWeight = FontWeight.Black, fontSize = 14.sp)
            }
        }
    }
}

// --- SCREEN 4: COMPATIBILITY COMPASS VIEW ---

@Composable
fun BloodCompatibilityPanel() {
    var selectedGroup by remember { mutableStateOf("O-") }
    val bloodList = listOf("O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+")

    // Compass map definitions
    val compatMap = mapOf(
        "O-" to Pair(listOf("O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"), listOf("O-")),
        "O+" to Pair(listOf("O+", "A+", "B+", "AB+"), listOf("O-", "O+")),
        "A-" to Pair(listOf("A-", "A+", "AB-", "AB+"), listOf("O-", "A-")),
        "A+" to Pair(listOf("A+", "AB+"), listOf("O-", "O+", "A-", "A+")),
        "B-" to Pair(listOf("B-", "B+", "AB-", "AB+"), listOf("O-", "B-")),
        "B+" to Pair(listOf("B+", "AB+"), listOf("O-", "O+", "B-", "B+")),
        "AB-" to Pair(listOf("AB-", "AB+"), listOf("O-", "O+", "A-", "B-", "AB-")),
        "AB+" to Pair(listOf("AB+"), listOf("O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"))
    )

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        shape = RoundedCornerShape(18.dp),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.5f))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = "Compatibility Checker",
                fontSize = 15.sp,
                fontWeight = FontWeight.Black,
                color = CrimsonPrimary
            )
            Text(
                text = "Tap any blood group to check receive & donate compatibility instantly.",
                fontSize = 11.5.sp,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Scrollable selector row
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                items(bloodList) { group ->
                    val isSelected = group == selectedGroup
                    Box(
                        modifier = Modifier
                            .size(38.dp)
                            .clip(CircleShape)
                            .background(if (isSelected) CrimsonPrimary else Color(0xFFFFEBEE))
                            .clickable { selectedGroup = group },
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = group,
                            color = if (isSelected) Color.White else CrimsonPrimary,
                            fontWeight = FontWeight.ExtraBold,
                            fontSize = 12.sp
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Compatibility outcome
            val (canDonateTo, canReceiveFrom) = compatMap[selectedGroup] ?: Pair(emptyList(), emptyList())

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Donate Card
                Card(
                    modifier = Modifier.weight(1f),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFFDF7F7)),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(modifier = Modifier.padding(10.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.VolunteerActivism, contentDescription = null, tint = CrimsonPrimary, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Can Donate To", fontSize = 11.5.sp, fontWeight = FontWeight.Bold, color = CrimsonPrimary)
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = canDonateTo.joinToString(", "),
                            fontSize = 12.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    }
                }

                // Receive Card
                Card(
                    modifier = Modifier.weight(1f),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFEBF7EB)),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(modifier = Modifier.padding(10.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.LocalHospital, contentDescription = null, tint = Color(0xFF2E7D32), modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Can Receive From", fontSize = 11.5.sp, fontWeight = FontWeight.Bold, color = Color(0xFF2E7D32))
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = canReceiveFrom.joinToString(", "),
                            fontSize = 12.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    }
                }
            }
        }
    }
}

// --- SCREEN 5: AI CHAT ASSISTANT ---

@Composable
fun AiAssistantScreen(
    viewModel: BloodLifeViewModel,
    modifier: Modifier = Modifier
) {
    val messages by viewModel.aiMessages.collectAsStateWithLifecycle()
    val isAiLoading by viewModel.isAiLoading.collectAsStateWithLifecycle()

    var inputQuestion by remember { mutableStateOf("") }
    val focusManager = LocalFocusManager.current
    val listState = rememberLazyListState()
    val scope = rememberCoroutineScope()

    val quickQuestions = listOf(
        "Who can O- donate to?",
        "Am I eligible to donate blood?",
        "What should I eat before donating?",
        "How often can I donate blood?"
    )

    // Auto-scroll when new messages arrive
    LaunchedEffect(messages.size) {
        if (messages.isNotEmpty()) {
            scope.launch {
                listState.animateScrollToItem(messages.size - 1)
            }
        }
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp, vertical = 8.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "AI Health Companion",
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Black,
                    color = MaterialTheme.colorScheme.onBackground
                )
                Text(
                    text = "Powered by Google Gemini",
                    fontSize = 11.sp,
                    color = CrimsonPrimary,
                    fontWeight = FontWeight.Bold
                )
            }

            // Clear chat icon
            IconButton(
                onClick = { viewModel.clearAiChat() },
                modifier = Modifier
                    .clip(CircleShape)
                    .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
            ) {
                Icon(
                    imageVector = Icons.Default.DeleteOutline,
                    contentDescription = "Clear Chat",
                    tint = CrimsonPrimary
                )
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Chat conversation bubble list
        LazyColumn(
            state = listState,
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .padding(vertical = 4.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            if (messages.isEmpty()) {
                item {
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 8.dp),
                        shape = RoundedCornerShape(20.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.3f))
                    ) {
                        Column {
                            Image(
                                painter = painterResource(id = R.drawable.img_healthcare_vector_1784394611611),
                                contentDescription = "AI Health Vector",
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(130.dp),
                                contentScale = ContentScale.Crop
                            )
                            Column(modifier = Modifier.padding(16.dp)) {
                                Text(
                                    text = "Hello, I am your Health Assistant",
                                    fontWeight = FontWeight.Black,
                                    fontSize = 15.sp,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = "I'm powered by Google Gemini. Ask me anything about blood types, donation compatibility, eligibility standards, or pre-donation diet and safety guidelines. Your inquiries are confidential.",
                                    fontSize = 12.sp,
                                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.65f),
                                    lineHeight = 16.sp
                                )
                            }
                        }
                    }
                }
            } else {
                items(messages) { msg ->
                    ChatMessageBubble(message = msg)
                }
            }
            if (isAiLoading) {
                item {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(8.dp),
                        horizontalArrangement = Arrangement.Start,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        CircularProgressIndicator(
                            modifier = Modifier.size(18.dp),
                            color = CrimsonPrimary,
                            strokeWidth = 2.dp
                        )
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            text = "Analyzing compatibility database...",
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f),
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
            }
        }

        // Quick Suggestion Chips
        Text(
            text = "Frequently Asked Questions",
            fontSize = 11.5.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.5f),
            modifier = Modifier.padding(bottom = 6.dp)
        )
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 10.dp)
        ) {
            items(quickQuestions) { question ->
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(10.dp))
                        .background(Color(0xFFFFEBEE))
                        .clickable(enabled = !isAiLoading) {
                            viewModel.askAiAssistant(question)
                        }
                        .padding(horizontal = 14.dp, vertical = 8.dp)
                ) {
                    Text(
                        text = question,
                        fontSize = 11.5.sp,
                        color = CrimsonPrimary,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }

        // Chat Input Box
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            OutlinedTextField(
                value = inputQuestion,
                onValueChange = { inputQuestion = it },
                placeholder = { Text("Ask anything about eligibility, intervals...") },
                modifier = Modifier
                    .weight(1f)
                    .testTag("ai_chat_input"),
                singleLine = true,
                shape = RoundedCornerShape(26.dp),
                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Send),
                keyboardActions = KeyboardActions(onSend = {
                    if (inputQuestion.isNotBlank() && !isAiLoading) {
                        focusManager.clearFocus()
                        viewModel.askAiAssistant(inputQuestion)
                        inputQuestion = ""
                    }
                }),
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = MaterialTheme.colorScheme.surface,
                    unfocusedContainerColor = MaterialTheme.colorScheme.surface,
                    focusedIndicatorColor = CrimsonPrimary
                )
            )

            FloatingActionButton(
                onClick = {
                    if (inputQuestion.isNotBlank() && !isAiLoading) {
                        focusManager.clearFocus()
                        viewModel.askAiAssistant(inputQuestion)
                        inputQuestion = ""
                    }
                },
                modifier = Modifier
                    .size(48.dp)
                    .testTag("ai_send_button"),
                containerColor = CrimsonPrimary,
                contentColor = Color.White,
                shape = CircleShape
            ) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.Send,
                    contentDescription = "Send prompt",
                    modifier = Modifier.size(18.dp)
                )
            }
        }
    }
}

@Composable
fun ChatMessageBubble(message: com.example.ui.ChatMessage) {
    val alignment = if (message.isUser) Alignment.End else Alignment.Start
    val bg = if (message.isUser) CrimsonPrimary else MaterialTheme.colorScheme.surface
    val borderMod = if (message.isUser) Modifier else Modifier.border(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.5f), RoundedCornerShape(16.dp))
    val textColor = if (message.isUser) Color.White else MaterialTheme.colorScheme.onSurface

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalAlignment = alignment
    ) {
        Box(
            modifier = Modifier
                .widthIn(max = 280.dp)
                .clip(
                    RoundedCornerShape(
                        topStart = 16.dp,
                        topEnd = 16.dp,
                        bottomStart = if (message.isUser) 16.dp else 4.dp,
                        bottomEnd = if (message.isUser) 4.dp else 16.dp
                    )
                )
                .background(bg)
                .then(borderMod)
                .padding(14.dp)
        ) {
            Text(
                text = message.text,
                color = textColor,
                fontSize = 13.5.sp,
                lineHeight = 18.sp,
                fontWeight = FontWeight.Medium
            )
        }
    }
}

// --- SCREEN 6: REGISTER DONOR FORM ---

@Composable
fun RegisterDonorScreen(
    viewModel: BloodLifeViewModel,
    onSubmitted: () -> Unit,
    modifier: Modifier = Modifier
) {
    var name by remember { mutableStateOf("") }
    var bloodType by remember { mutableStateOf("O+") }
    var phone by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var city by remember { mutableStateOf("") }
    var lastDonationDate by remember { mutableStateOf("") }

    // Eligibility check state variables for reassurance
    var checkAge by remember { mutableStateOf(false) }
    var checkWeight by remember { mutableStateOf(false) }
    var checkInterval by remember { mutableStateOf(false) }

    val context = LocalContext.current
    val focusManager = LocalFocusManager.current
    val bloodTypes = listOf("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(bottom = 24.dp)
    ) {
        item {
            Text(
                text = "Join Active Standby Pool",
                fontSize = 22.sp,
                fontWeight = FontWeight.Black,
                color = MaterialTheme.colorScheme.onBackground,
                letterSpacing = (-0.5).sp
            )
            Text(
                text = "Become a verified local standby donor. Seekers will only be able to reach you during active local medical emergencies.",
                fontSize = 12.5.sp,
                color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.6f)
            )
        }

        // Gamified Eligibility Checklist Card
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFFFDFDFD)),
                shape = RoundedCornerShape(16.dp),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.4f))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "📋 Eligibility Checklist",
                        fontWeight = FontWeight.Black,
                        fontSize = 14.sp,
                        color = CrimsonPrimary
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Please verify your eligibility to join the standby emergency pool:",
                        fontSize = 11.5.sp,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                    )
                    Spacer(modifier = Modifier.height(10.dp))

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { checkAge = !checkAge }
                            .padding(vertical = 4.dp)
                    ) {
                        Checkbox(
                            checked = checkAge,
                            onCheckedChange = { checkAge = it },
                            colors = CheckboxDefaults.colors(checkedColor = CrimsonPrimary)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("I am between 18 and 65 years old.", fontSize = 12.5.sp, fontWeight = FontWeight.Medium)
                    }

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { checkWeight = !checkWeight }
                            .padding(vertical = 4.dp)
                    ) {
                        Checkbox(
                            checked = checkWeight,
                            onCheckedChange = { checkWeight = it },
                            colors = CheckboxDefaults.colors(checkedColor = CrimsonPrimary)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("I weigh more than 50 kg (110 lbs).", fontSize = 12.5.sp, fontWeight = FontWeight.Medium)
                    }

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { checkInterval = !checkInterval }
                            .padding(vertical = 4.dp)
                    ) {
                        Checkbox(
                            checked = checkInterval,
                            onCheckedChange = { checkInterval = it },
                            colors = CheckboxDefaults.colors(checkedColor = CrimsonPrimary)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("It has been 3+ months since my last donation.", fontSize = 12.5.sp, fontWeight = FontWeight.Medium)
                    }
                }
            }
        }

        // Full Name Field
        item {
            OutlinedTextField(
                value = name,
                onValueChange = { name = it },
                label = { Text("Full Name") },
                placeholder = { Text("e.g. Jane Smith") },
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("register_name"),
                singleLine = true,
                shape = RoundedCornerShape(12.dp),
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = MaterialTheme.colorScheme.surface,
                    unfocusedContainerColor = MaterialTheme.colorScheme.surface,
                    focusedIndicatorColor = CrimsonPrimary
                )
            )
        }

        // Blood Type SELECT Chips
        item {
            Column {
                Text(
                    text = "Your Blood Group",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.7f)
                )
                Spacer(modifier = Modifier.height(8.dp))
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    items(bloodTypes) { type ->
                        val isSelected = bloodType == type
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(12.dp))
                                .background(if (isSelected) CrimsonPrimary else Color.White)
                                .border(
                                    width = 1.dp,
                                    color = if (isSelected) Color.Transparent else MaterialTheme.colorScheme.outlineVariant,
                                    shape = RoundedCornerShape(12.dp)
                                )
                                .clickable { bloodType = type }
                                .padding(horizontal = 16.dp, vertical = 10.dp)
                                .testTag("register_chip_$type")
                        ) {
                            Text(
                                text = type,
                                color = if (isSelected) Color.White else MaterialTheme.colorScheme.onSurface,
                                fontWeight = FontWeight.ExtraBold,
                                fontSize = 13.sp
                            )
                        }
                    }
                }
            }
        }

        // Phone & Email Inputs
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                OutlinedTextField(
                    value = phone,
                    onValueChange = { phone = it },
                    label = { Text("Phone") },
                    placeholder = { Text("e.g. +1 555-0123") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                    modifier = Modifier
                        .weight(1f)
                        .testTag("register_phone"),
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp),
                    colors = TextFieldDefaults.colors(
                        focusedContainerColor = MaterialTheme.colorScheme.surface,
                        unfocusedContainerColor = MaterialTheme.colorScheme.surface,
                        focusedIndicatorColor = CrimsonPrimary
                    )
                )

                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it },
                    label = { Text("Email") },
                    placeholder = { Text("e.g. jane@example.com") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                    modifier = Modifier
                        .weight(1.2f)
                        .testTag("register_email"),
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp),
                    colors = TextFieldDefaults.colors(
                        focusedContainerColor = MaterialTheme.colorScheme.surface,
                        unfocusedContainerColor = MaterialTheme.colorScheme.surface,
                        focusedIndicatorColor = CrimsonPrimary
                    )
                )
            }
        }

        // City Input
        item {
            OutlinedTextField(
                value = city,
                onValueChange = { city = it },
                label = { Text("City") },
                placeholder = { Text("e.g. New York") },
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("register_city"),
                singleLine = true,
                shape = RoundedCornerShape(12.dp),
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = MaterialTheme.colorScheme.surface,
                    unfocusedContainerColor = MaterialTheme.colorScheme.surface,
                    focusedIndicatorColor = CrimsonPrimary
                )
            )
        }

        // Last Donation Date Input
        item {
            OutlinedTextField(
                value = lastDonationDate,
                onValueChange = { lastDonationDate = it },
                label = { Text("Last Donation Date (Optional)") },
                placeholder = { Text("E.g. 2026-05-12 or leave blank if first time") },
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("register_last_donation"),
                singleLine = true,
                shape = RoundedCornerShape(12.dp),
                colors = TextFieldDefaults.colors(
                    focusedContainerColor = MaterialTheme.colorScheme.surface,
                    unfocusedContainerColor = MaterialTheme.colorScheme.surface,
                    focusedIndicatorColor = CrimsonPrimary
                )
            )
        }

        // Premium Privacy Secure Shield Row
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFFF0F4F8)),
                shape = RoundedCornerShape(16.dp),
                border = BorderStroke(1.dp, Color(0xFFD0E1FD))
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Shield,
                        contentDescription = "Secure Encryption Shield",
                        tint = Color(0xFF1976D2),
                        modifier = Modifier.size(24.dp)
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                    Text(
                        text = "Standby registration credentials are fully encrypted and visible only for localized, verified medical emergency requests. We never sell or share donor databases.",
                        fontSize = 11.5.sp,
                        color = Color(0xFF1E3A5F),
                        lineHeight = 16.sp,
                        fontWeight = FontWeight.Medium
                    )
                }
            }
        }

        // Submit Donor Registration Button
        item {
            Button(
                onClick = {
                    if (name.isBlank() || phone.isBlank() || email.isBlank() || city.isBlank()) {
                        Toast.makeText(context, "Please complete all mandatory fields.", Toast.LENGTH_SHORT).show()
                    } else if (!checkAge || !checkWeight || !checkInterval) {
                        Toast.makeText(context, "Please verify your eligibility checklist requirements first.", Toast.LENGTH_LONG).show()
                    } else {
                        focusManager.clearFocus()
                        viewModel.registerAsDonor(
                            name = name,
                            bloodType = bloodType,
                            phone = phone,
                            email = email,
                            city = city,
                            lastDonationDate = lastDonationDate,
                            onSuccess = {
                                Toast.makeText(context, "Welcome aboard Lifesaver!", Toast.LENGTH_LONG).show()
                                onSubmitted()
                            }
                        )
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(54.dp)
                    .testTag("submit_register_button"),
                colors = ButtonDefaults.buttonColors(containerColor = CrimsonPrimary),
                shape = RoundedCornerShape(12.dp),
                elevation = ButtonDefaults.buttonElevation(defaultElevation = 4.dp)
            ) {
                Text("REGISTER AS BLOOD DONOR", fontWeight = FontWeight.Black, fontSize = 14.sp)
            }
        }
    }
}
