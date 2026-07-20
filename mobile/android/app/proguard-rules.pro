# Flutter Rules
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.** { *; }
-keep class io.flutter.util.** { *; }
-keep class io.flutter.view.** { *; }
-keep class io.flutter.embedding.** { *; }
-dontwarn io.flutter.embedding.**

# Firebase Rules
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**

# Hive Rules
-keep class com.hive.** { *; }
-keep class hive.** { *; }

# Google Maps / Location
-keep class com.google.android.gms.maps.** { *; }
-dontwarn com.google.android.gms.maps.**

# Keep models for reflection/JSON mapping
-keep class com.smartbloodlife.app.src.data.models.** { *; }
