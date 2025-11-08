import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPacientes, createPaciente } from "@/lib/api";
import PacienteTable from "@/components/pacientes/PacienteTable";
import PacienteForm from "@/components/pacientes/PacienteForm";
import { toast } from "sonner";
import type { Paciente } from "@/types";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";

export default function Pacientes() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: pacientes = [], isLoading } = useQuery({
    queryKey: ["pacientes"],
    queryFn: getPacientes,
  });

  const createMutation = useMutation({
    mutationFn: createPaciente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pacientes"] });
      setIsFormOpen(false);
      toast.success("Paciente registrado exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al registrar paciente");
    },
  });

  const handleSubmit = (data: Paciente) => {
    createMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pacientes"
        description="Gestiona todos los pacientes registrados en el sistema"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard/admin' },
          { label: 'Pacientes' }
        ]}
        actions={
          <Button
            onClick={() => setIsFormOpen(true)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Registrar Paciente
          </Button>
        }
      />

      {isLoading ? (
        <LoadingState message="Cargando pacientes..." />
      ) : pacientes.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No hay pacientes registrados"
          description="Comienza registrando el primer paciente del sistema"
          action={{
            label: 'Registrar Paciente',
            onClick: () => setIsFormOpen(true)
          }}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <PacienteTable pacientes={pacientes} />
        </motion.div>
      )}

      <PacienteForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}
