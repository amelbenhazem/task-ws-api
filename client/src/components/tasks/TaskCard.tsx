"use client";

import { Task } from '@/types/task';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const statusColors = {
  en_cours: 'bg-yellow-500',
  termine: 'bg-green-500',
  annule: 'bg-red-500',
};

const statusLabels = {
  en_cours: 'En cours',
  termine: 'Terminé',
  annule: 'Annulé',
};

const formatDate = (date: Date | string) => {
  return format(new Date(date), 'dd/MM/yyyy');
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{task.title}</CardTitle>
            <CardDescription className="mt-2">
              {task.description || 'Aucune description'}
            </CardDescription>
          </div>
          <Badge className={statusColors[task.status]}>
            {statusLabels[task.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-muted-foreground">
          {task.dueDate && (
            <p>
              Échéance : {formatDate(task.dueDate)}
            </p>
          )}
          <p>
            Créé le : {formatDate(task.createdAt)}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(task)}
        >
          Modifier
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(task._id)}
        >
          Supprimer
        </Button>
      </CardFooter>
    </Card>
  );
} 