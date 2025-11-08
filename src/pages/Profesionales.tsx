import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProfesionales, createProfesional } from "@/lib/api";
import ProfesionalTable from "@/components/profesionales/ProfesionalTable";
import ProfesionalForm from "@/components/profesionales/ProfesionalForm";
import { toast } from "sonner";
import type { ProfesionalSalud } from "@/types";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";

export default function Profesionales() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: profesionales = [], isLoading } = useQuery({
    queryKey: ["profesionales"],
    queryFn: getProfesionales,
  });

  const createMutation = useMutation({
    mutationFn: createProfesional,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profesionales"] });
      setIsFormOpen(false);
      toast.success("Profesional registrado exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al registrar profesional");
    },
  });

  const handleSubmit = (data: ProfesionalSalud) => {
    createMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profesionales de Salud"
        description="Gestiona médicos y profesionales del sistema"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard/admin' },
          { label: 'Profesionales' }
        ]}
        actions={
          <Button
            onClick={() => setIsFormOpen(true)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Registrar Profesional
          </Button>
        }
      />

      {isLoading ? (
        <LoadingState message="Cargando profesionales..." />
      ) : profesionales.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No hay profesionales registrados"
          description="Comienza registrando el primer profesional del sistema"
          action={{
            label: 'Registrar Profesional',
            onClick: () => setIsFormOpen(true)
          }}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ProfesionalTable profesionales={profesionales} />
        </motion.div>
      )}

      <ProfesionalForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}
