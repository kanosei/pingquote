import { getUniqueClients, getUniqueLineItems } from "@/app/actions/quotes";
import { NewQuoteForm } from "@/components/new-quote-form";
import { DashboardHeader } from "@/components/dashboard-header";

export default async function NewQuotePage() {
  const [clients, lineItems] = await Promise.all([
    getUniqueClients(),
    getUniqueLineItems(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Create New Quote</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Fill in the details below to create a shareable quote
          </p>
        </div>

        <NewQuoteForm clients={clients} lineItems={lineItems} />
      </main>
    </div>
  );
}
