import { getEvenements } from "@/src/api/generated/événements/événements";

export default async function EventsPage() {
  const response = await getEvenements();
  const events = response.data;

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-8">Événements</h1>

      <div className="flex flex-col gap-4">
        {events.map((evt) => (
          <a
            key={evt.id}
            href={`/events/${evt.id}`}
            className="border border-gray-200 rounded-xl p-5 hover:border-gray-400 transition-colors"
          >
            <h2 className="text-lg font-medium text-gray-900">{evt.titre}</h2>
            <p className="text-sm text-gray-400 mt-1">{evt.lieu}</p>
            <p className="text-sm text-gray-500 mt-2">{evt.description}</p>
          </a>
        ))}
      </div>
    </main>
  );
}