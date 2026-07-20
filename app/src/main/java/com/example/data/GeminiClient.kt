package com.example.data

import com.example.BuildConfig
import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.http.Query
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

// --- Moshi Data Models for Gemini ---

@JsonClass(generateAdapter = true)
data class GeminiPart(
    @Json(name = "text") val text: String? = null
)

@JsonClass(generateAdapter = true)
data class GeminiContent(
    @Json(name = "parts") val parts: List<GeminiPart>
)

@JsonClass(generateAdapter = true)
data class GeminiRequest(
    @Json(name = "contents") val contents: List<GeminiContent>,
    @Json(name = "systemInstruction") val systemInstruction: GeminiContent? = null
)

@JsonClass(generateAdapter = true)
data class GeminiCandidate(
    @Json(name = "content") val content: GeminiContent
)

@JsonClass(generateAdapter = true)
data class GeminiResponse(
    @Json(name = "candidates") val candidates: List<GeminiCandidate>? = null
)

// --- Retrofit API Service ---

interface GeminiApiService {
    @POST("v1beta/models/gemini-3.5-flash:generateContent")
    suspend fun generateContent(
        @Query("key") apiKey: String,
        @Body request: GeminiRequest
    ): GeminiResponse
}

// --- Retrofit Client ---

object GeminiRetrofitClient {
    private const val BASE_URL = "https://generativelanguage.googleapis.com/"

    private val moshi = Moshi.Builder()
        .addLast(KotlinJsonAdapterFactory())
        .build()

    private val okHttpClient = OkHttpClient.Builder()
        .connectTimeout(60, java.util.concurrent.TimeUnit.SECONDS)
        .readTimeout(60, java.util.concurrent.TimeUnit.SECONDS)
        .writeTimeout(60, java.util.concurrent.TimeUnit.SECONDS)
        .build()

    val service: GeminiApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(MoshiConverterFactory.create(moshi))
            .build()
            .create(GeminiApiService::class.java)
    }
}

// --- Helper Functions ---

object GeminiAssistant {
    private const val SYSTEM_PROMPT = """
You are the AI Health & Compatibility Assistant for "Smart Blood Life", a premium blood donation and seeker platform. 
Your goal is to help users understand blood compatibility, eligibility guidelines, donation schedules, benefits, and healthy habits to improve blood quality.

Keep your responses structured, helpful, encouraging, and highly professional. Use bullet points and clear headings where appropriate.
If the question is about blood compatibility (e.g., "who can A+ donate to"), provide a structured comparison or table-like bullet outline.

IMPORTANT: Always include a professional medical disclaimer at the very end of your response, such as: "Disclaimer: This information is for educational purposes. Always consult with a certified medical practitioner or local donation center before making medical decisions."
"""

    suspend fun askAssistant(prompt: String, chatHistory: List<GeminiContent> = emptyList()): String = withContext(Dispatchers.IO) {
        val apiKey = BuildConfig.GEMINI_API_KEY
        if (apiKey.isEmpty() || apiKey == "MY_GEMINI_API_KEY") {
            return@withContext "API Key is not configured in the Secrets panel. Please ask the developer to configure GEMINI_API_KEY."
        }

        // Prepare full contents, appending history if available
        val contents = ArrayList<GeminiContent>()
        contents.addAll(chatHistory)
        contents.add(GeminiContent(parts = listOf(GeminiPart(text = prompt))))

        val request = GeminiRequest(
            contents = contents,
            systemInstruction = GeminiContent(parts = listOf(GeminiPart(text = SYSTEM_PROMPT)))
        )

        try {
            val response = GeminiRetrofitClient.service.generateContent(apiKey, request)
            response.candidates?.firstOrNull()?.content?.parts?.firstOrNull()?.text 
                ?: "I couldn't generate a response. Please try asking in a different way."
        } catch (e: Exception) {
            e.printStackTrace()
            "Error: ${e.localizedMessage ?: "Failed to connect to the assistant. Please check your internet connection and try again."}"
        }
    }
}
