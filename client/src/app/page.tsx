import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold mb-6">
          Gérez vos tâches en temps réel
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Une application moderne pour gérer vos tâches avec des mises à jour en temps réel,
          des notifications instantanées et un tableau de bord intuitif.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/register">
              Commencer gratuitement
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">
              Se connecter
            </Link>
          </Button>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Temps réel</h3>
            <p className="text-muted-foreground">
              Toutes les modifications sont synchronisées instantanément entre tous les utilisateurs.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Collaboratif</h3>
            <p className="text-muted-foreground">
              Assignez des tâches, suivez leur progression et collaborez efficacement.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Statistiques</h3>
            <p className="text-muted-foreground">
              Visualisez vos performances avec des statistiques détaillées.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
