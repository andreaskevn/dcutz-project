<?php

use App\Http\Controllers\PelangganController;
use App\Http\Controllers\PresensiController;
use App\Http\Controllers\ReservasiController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\HomePageController;
use App\Http\Controllers\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//         HomePageController::class,
//         'index'
//     ]);
// });

Route::get('/', [HomePageController::class, 'index'])->name('home.index');
Route::post('/', [HomePageController::class, 'store'])->name('home.store');
Route::get('/check-pelanggan', [HomePageController::class, 'checkPelanggan'])
    ->name('home.checkPelanggan')
    ->withoutMiddleware(['inertia']);

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard/page');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::get('/users/{id}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{id}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('users.destroy');
    Route::post('/users/import', [UserController::class, 'import'])->name('users.import.store');


    Route::get('/presensi', [PresensiController::class, 'index'])->name('presensi.index');
    Route::get('/presensi/create', [PresensiController::class, 'create'])->name('presensi.create');
    Route::post('/presensi', [PresensiController::class, 'store'])->name('presensi.store');
    Route::get('/presensi/{id}/edit', [PresensiController::class, 'edit'])->name('presensi.edit');
    Route::put('/presensi/{id}', [PresensiController::class, 'update'])->name('presensi.update');
    Route::delete('/presensi/{id}', [PresensiController::class, 'destroy'])->name('presensi.destroy');
    Route::post('/presensi/import', [PresensiController::class, 'importStore'])->name('presensi.import.store');
    Route::get('/presensi/{id}/detail', [PresensiController::class, 'show'])->name('presensi.show');
    Route::get('/presensi/export', [PresensiController::class, 'export'])->name('presensi.export');



    Route::get('/reservasi', [ReservasiController::class, 'index'])->name('reservasi.index');
    Route::get('/reservasi/create', [ReservasiController::class, 'create'])->name('reservasi.create');
    Route::post('/reservasi', [ReservasiController::class, 'store'])->name('reservasi.store');
    Route::get('/reservasi/{id}/edit', [ReservasiController::class, 'edit'])->name('reservasi.edit');
    Route::get('/reservasi/{id}/detail', [ReservasiController::class, 'show'])->name('reservasi.show');
    Route::put('/reservasi/{id}', [ReservasiController::class, 'update'])->name('reservasi.update');
    Route::delete('/reservasi/{id}', [ReservasiController::class, 'destroy'])->name('reservasi.destroy');
    Route::post('/reservasi/import', [ReservasiController::class, 'import'])->name('reservasi.import.store');


    Route::get('/pelanggan', [PelangganController::class, 'index'])->name('pelanggan.index');
    Route::get('/pelanggan/create', [PelangganController::class, 'create'])->name('pelanggan.create');
    Route::post('/pelanggan', [PelangganController::class, 'store'])->name('pelanggan.store');
    Route::get('/pelanggan/{id}/edit', [PelangganController::class, 'edit'])->name('pelanggan.edit');
    Route::put('/pelanggan/{id}', [PelangganController::class, 'update'])->name('pelanggan.update');
    Route::delete('/pelanggan/{id}', [PelangganController::class, 'destroy'])->name('pelanggan.destroy');
    Route::post('/pelanggan/import', [PelangganController::class, 'import'])->name('pelanggan.import.store');
});

require __DIR__ . '/auth.php';
