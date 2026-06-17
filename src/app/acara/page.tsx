import Image from "next/image";
import { Calendar, MapPin, Clock, Info } from "lucide-react";
import { getEvents } from "@/lib/db";

export const revalidate = 60;

export default async function AcaraPage() {
  const events = await getEvents();
  const now = new Date();

  // Split into upcoming and past
  const upcomingEvents = events.filter((e) => new Date(e.endDate || e.startDate) >= now);
  const pastEvents = events.filter((e) => new Date(e.endDate || e.startDate) < now);

  const formatFullDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Page Header */}
      <div className="bg-primary-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight">Agenda Kegiatan Padukuhan</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-primary-200">
            Temukan jadwal rukun warga, sosialisasi, posyandu, pentas seni, dan kerja bakti Sambeng.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-12 sm:px-6 lg:px-8 space-y-16">
        {/* Upcoming Events Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Acara Mendatang</h2>
            <div className="h-1 w-12 bg-primary-600 rounded mt-2"></div>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center text-gray-500 text-sm">
              Saat ini belum ada agenda acara mendatang yang dijadwalkan.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition group"
                >
                  {/* Poster/Image Column */}
                  <div className="relative h-48 md:h-auto md:w-80 flex-shrink-0 bg-gray-100">
                    <Image
                      src={event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop"}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {/* Details Column */}
                  <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-700 transition leading-snug">
                        {event.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {event.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 mt-6 border-t border-gray-50 text-xs text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4.5 w-4.5 text-primary-600 flex-shrink-0" />
                        <div>
                          <span className="font-semibold block text-gray-900">Hari / Tanggal</span>
                          <span>{formatFullDate(event.startDate)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4.5 w-4.5 text-primary-600 flex-shrink-0" />
                        <div>
                          <span className="font-semibold block text-gray-900">Waktu Acara</span>
                          <span>
                            {formatTime(event.startDate)} - {formatTime(event.endDate)} WIB
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4.5 w-4.5 text-primary-600 flex-shrink-0" />
                        <div>
                          <span className="font-semibold block text-gray-900">Tempat Pelaksanaan</span>
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past Events Section */}
        {pastEvents.length > 0 && (
          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-500">Acara yang Telah Terlaksana</h2>
              <div className="h-0.5 w-12 bg-gray-300 rounded mt-2"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 opacity-75 hover:opacity-100 transition duration-200">
              {pastEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-xl border border-gray-100 p-5 flex space-x-4 shadow-sm"
                >
                  <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                    <Image
                      src={event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop"}
                      alt={event.title}
                      fill
                      className="object-cover grayscale"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-sm text-gray-700 line-clamp-1">
                      {event.title}
                    </h3>
                    <div className="space-y-1 text-[11px] text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                        <span>{new Date(event.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
