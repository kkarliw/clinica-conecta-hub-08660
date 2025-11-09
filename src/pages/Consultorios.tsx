import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getConsultorios, createConsultorio, updateConsultorio, deleteConsultorio } from "@/lib/api";
import ConsultorioTable from "@/components/consultorios/ConsultorioTable";
import ConsultorioForm from "@/components/consultorios/ConsultorioForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { toast } from "sonner";
import type { Consultorio } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

export default function Consultorios() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingConsultorio, setEditingConsultorio] = useState<Consultorio | undefined>();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const dashboardPath = user?.rol === "ADMIN" ? "/admin/dashboard" : "/recepcion/dashboard";

  const { data: consultorios = [], isLoading } = useQuery({
    queryKey: ["consultorios"],
    queryFn: getConsultorios,
  });

  const createMutation = useMutation({
    mutationFn: createConsultorio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultorios"] });
      setIsFormOpen(false);
      setEditingConsultorio(undefined);
      toast.success("Consultorio registrado exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al registrar consultorio");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Consultorio }) => 
      updateConsultorio(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultorios"] });
      setIsFormOpen(false);
      setEditingConsultorio(undefined);
      toast.success("Consultorio actualizado exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al actualizar consultorio");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteConsultorio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultorios"] });
      toast.success("Consultorio eliminado exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al eliminar consultorio");
    },
  });

  const handleSubmit = (data: Consultorio) => {
    if (editingConsultorio?.id) {
      updateMutation.mutate({ id: editingConsultorio.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (consultorio: Consultorio) => {
    setEditingConsultorio(consultorio);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleOpenNew = () => {
    setEditingConsultorio(undefined);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Consultorios"
        description="Gestiona los consultorios y salas del centro médico"
        breadcrumbs={[
          { label: "Inicio", href: dashboardPath },
          { label: "Consultorios" },
        ]}
        actions={
          <Button onClick={handleOpenNew} className="gap-2">
            <Plus className="w-4 h-4" />
            Nuevo Consultorio
          </Button>
        }
      />

      {isLoading ? (
        <LoadingState message="Cargando consultorios..." />
      ) : consultorios.length === 0 ? (
        <EmptyState
          title="No hay consultorios registrados"
          description="Comienza registrando el primer consultorio del centro médico"
          action={{
            label: "Registrar Consultorio",
            onClick: handleOpenNew
          }}
        />
      ) : (
        <ConsultorioTable 
          consultorios={consultorios}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <ConsultorioForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingConsultorio(undefined);
        }}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
        consultorio={editingConsultorio}
      />
    </div>
  );
}
