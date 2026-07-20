package com.example.data

import android.content.Context
import androidx.room.Dao
import androidx.room.Database
import androidx.room.Entity
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.PrimaryKey
import androidx.room.Query
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.launch

// --- Entities ---

@Entity(tableName = "donors")
data class Donor(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val name: String,
    val bloodType: String, // A+, A-, B+, B-, AB+, AB-, O+, O-
    val phone: String,
    val email: String,
    val city: String,
    val lastDonationDate: String, // e.g. "2026-04-10" or "Never"
    val isAvailable: Boolean = true
)

@Entity(tableName = "blood_requests")
data class BloodRequest(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val patientName: String,
    val bloodType: String,
    val hospitalName: String,
    val city: String,
    val contactPhone: String,
    val unitsNeeded: Int,
    val urgency: String, // Critical, Urgent, Normal
    val additionalNotes: String,
    val timestamp: Long = System.currentTimeMillis()
)

// --- DAOs ---

@Dao
interface DonorDao {
    @Query("SELECT * FROM donors ORDER BY name ASC")
    fun getAllDonors(): Flow<List<Donor>>

    @Query("SELECT * FROM donors WHERE bloodType = :bloodType ORDER BY name ASC")
    fun getDonorsByBloodType(bloodType: String): Flow<List<Donor>>

    @Query("SELECT * FROM donors WHERE city LIKE :cityQuery ORDER BY name ASC")
    fun getDonorsByCity(cityQuery: String): Flow<List<Donor>>

    @Query("SELECT * FROM donors WHERE bloodType = :bloodType AND city LIKE :cityQuery ORDER BY name ASC")
    fun searchDonors(bloodType: String, cityQuery: String): Flow<List<Donor>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertDonor(donor: Donor)

    @Query("DELETE FROM donors WHERE id = :id")
    suspend fun deleteDonorById(id: Int)
}

@Dao
interface BloodRequestDao {
    @Query("SELECT * FROM blood_requests ORDER BY timestamp DESC")
    fun getAllRequests(): Flow<List<BloodRequest>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertRequest(request: BloodRequest)

    @Query("DELETE FROM blood_requests WHERE id = :id")
    suspend fun deleteRequestById(id: Int)
}

// --- Room Database ---

@Database(entities = [Donor::class, BloodRequest::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun donorDao(): DonorDao
    abstract fun bloodRequestDao(): BloodRequestDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context, scope: CoroutineScope): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "smart_blood_life_db"
                )
                .addCallback(AppDatabaseCallback(scope))
                .build()
                INSTANCE = instance
                instance
            }
        }
    }

    private class AppDatabaseCallback(
        private val scope: CoroutineScope
    ) : RoomDatabase.Callback() {
        override fun onCreate(db: SupportSQLiteDatabase) {
            super.onCreate(db)
            scope.launch(Dispatchers.IO) {
                var database = INSTANCE
                while (database == null) {
                    kotlinx.coroutines.delay(20)
                    database = INSTANCE
                }
                populateInitialData(database.donorDao(), database.bloodRequestDao())
            }
        }

        suspend fun populateInitialData(donorDao: DonorDao, requestDao: BloodRequestDao) {
            // Seed sample active requests
            requestDao.insertRequest(
                BloodRequest(
                    patientName = "Alex Harrison",
                    bloodType = "O-",
                    hospitalName = "St. Jude Medical Center",
                    city = "New York",
                    contactPhone = "+1 (555) 019-2834",
                    unitsNeeded = 3,
                    urgency = "Critical",
                    additionalNotes = "Required for emergency heart bypass surgery. Any help is deeply appreciated."
                )
            )
            requestDao.insertRequest(
                BloodRequest(
                    patientName = "Sophia Martinez",
                    bloodType = "AB+",
                    hospitalName = "General Care Clinic",
                    city = "Los Angeles",
                    contactPhone = "+1 (555) 014-9988",
                    unitsNeeded = 2,
                    urgency = "Urgent",
                    additionalNotes = "Patient undergoing chemotherapy. Need blood platelets ASAP."
                )
            )
            requestDao.insertRequest(
                BloodRequest(
                    patientName = "Marcus Thompson",
                    bloodType = "A+",
                    hospitalName = "Metro General Hospital",
                    city = "Chicago",
                    contactPhone = "+1 (555) 012-4455",
                    unitsNeeded = 4,
                    urgency = "Normal",
                    additionalNotes = "Scheduled surgery on Monday. Family donor pool is short."
                )
            )

            // Seed sample donors
            donorDao.insertDonor(
                Donor(
                    name = "Robert Carter",
                    bloodType = "O-",
                    phone = "+1 (555) 017-4821",
                    email = "robert.c@example.com",
                    city = "New York",
                    lastDonationDate = "2026-05-12",
                    isAvailable = true
                )
            )
            donorDao.insertDonor(
                Donor(
                    name = "Emily Watson",
                    bloodType = "A+",
                    phone = "+1 (555) 019-3322",
                    email = "emily.w@example.com",
                    city = "New York",
                    lastDonationDate = "2026-06-01",
                    isAvailable = true
                )
            )
            donorDao.insertDonor(
                Donor(
                    name = "Daniel Kim",
                    bloodType = "B+",
                    phone = "+1 (555) 015-7766",
                    email = "daniel.kim@example.com",
                    city = "Los Angeles",
                    lastDonationDate = "2026-03-20",
                    isAvailable = true
                )
            )
            donorDao.insertDonor(
                Donor(
                    name = "Sarah Jenkins",
                    bloodType = "O+",
                    phone = "+1 (555) 011-8899",
                    email = "sarah.j@example.com",
                    city = "Chicago",
                    lastDonationDate = "Never",
                    isAvailable = true
                )
            )
            donorDao.insertDonor(
                Donor(
                    name = "Michael Vance",
                    bloodType = "AB-",
                    phone = "+1 (555) 013-1122",
                    email = "michael.v@example.com",
                    city = "Houston",
                    lastDonationDate = "2026-02-15",
                    isAvailable = true
                )
            )
            donorDao.insertDonor(
                Donor(
                    name = "Jessica Taylor",
                    bloodType = "A-",
                    phone = "+1 (555) 016-5544",
                    email = "jessica.t@example.com",
                    city = "San Francisco",
                    lastDonationDate = "2026-04-05",
                    isAvailable = true
                )
            )
        }
    }
}

// --- Repository ---

class BloodLifeRepository(private val db: AppDatabase) {
    val donorDao = db.donorDao()
    val requestDao = db.bloodRequestDao()

    val allDonors: Flow<List<Donor>> = donorDao.getAllDonors()
    val allRequests: Flow<List<BloodRequest>> = requestDao.getAllRequests()

    fun searchDonors(bloodType: String, city: String): Flow<List<Donor>> {
        val cityQuery = if (city.isEmpty()) "%" else "%$city%"
        return if (bloodType.isEmpty() || bloodType == "Any") {
            donorDao.getDonorsByCity(cityQuery)
        } else {
            donorDao.searchDonors(bloodType, cityQuery)
        }
    }

    suspend fun insertDonor(donor: Donor) = donorDao.insertDonor(donor)
    suspend fun deleteDonor(id: Int) = donorDao.deleteDonorById(id)

    suspend fun insertRequest(request: BloodRequest) = requestDao.insertRequest(request)
    suspend fun deleteRequest(id: Int) = requestDao.deleteRequestById(id)
}
