package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.example.ui.BloodLifeApp
import com.example.ui.BloodLifeViewModel
import com.example.ui.theme.MyApplicationTheme

class MainActivity : ComponentActivity() {
  
  private val viewModel: BloodLifeViewModel by viewModels()

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    enableEdgeToEdge()
    setContent {
      MyApplicationTheme(dynamicColor = false) {
        Surface(
          modifier = Modifier.fillMaxSize()
        ) {
          BloodLifeApp(viewModel = viewModel)
        }
      }
    }
  }
}

