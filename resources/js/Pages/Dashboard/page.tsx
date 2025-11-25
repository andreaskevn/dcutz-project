import CapsterBarChart from '@/Components/ui/capster-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import Layout from '@/Layouts/Layout';
import { Head } from '@inertiajs/react';


export default function Dashboard({
    topEmployee,
    topKapter,
    totalReservasiToday,
    totalReservasiMonth,
    capsterChart,
    layananTop,
    presensiTodayChart
}) {
    return (
        <Layout
        >
            <Head title="Dashboard" />
            <div className="px-8 py-10 w-full">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
                    <Card>
                        <CardHeader>
                            <CardTitle>Karyawan Terajin Bulan Ini</CardTitle>
                            <CardDescription>Karyawan dengan kehadiran terbanyak</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl font-semibold">{topEmployee?.name ?? '-'}</p>
                            <p className="text-sm text-gray-600">
                                Total hadir: {topEmployee?.total ?? 0} hari
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Kapter Terbanyak Dibooking</CardTitle>
                            <CardDescription>Kapter paling populer bulan ini</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl font-semibold">{topKapter?.name ?? '-'}</p>
                            <p className="text-sm text-gray-600">
                                Total booking: {topKapter?.total ?? 0} kali
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Total Reservasi</CardTitle>
                            <CardDescription>Hari ini & bulan ini</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl font-semibold">
                                Hari ini: {totalReservasiToday ?? 0}
                            </p>
                            <p className="text-xl font-semibold mt-2">
                                Bulan ini: {totalReservasiMonth ?? 0}
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
                    <CapsterBarChart
                        data={capsterChart}
                        monthLabel="Reservasi Bulan Ini"
                    />
                    <CapsterBarChart
                        data={layananTop}
                        monthLabel="Layanan Bulan Ini"
                    />
                    <CapsterBarChart
                        data={presensiTodayChart}
                        monthLabel="Kehadiran Karyawan Hari Ini"
                    />
                </div>
            </div>
        </Layout>
    );
}
