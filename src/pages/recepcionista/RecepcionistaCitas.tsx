import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCitas, createCita, getPacientes, getProfesionales } from "@/lib/api";
import CitaTable from "@/components/citas/CitaTable";
import CitaForm from "@/components/citas/CitaForm";
import { toast } from "sonner";
import type { CitaMedica } from "@/types";
import { motion } from "framer-motion";

export default function RecepcionistaCitas() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: citas = [], isLoading } = useQuery({
    queryKey: ["citas"],
    queryFn: getCitas,
  });

  const { data: pacientes = [] } = useQuery({
    queryKey: ["pacientes"],
    queryFn: getPacientes,
  });

  const { data: profesionales = [] } = useQuery({
    queryKey: ["profesionales"],
    queryFn: getProfesionales,
  });

  const createMutation = useMutation({
    mutationFn: createCita,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["citas"] });
      setIsFormOpen(false);
      toast.success("Cita agendada exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al agendar cita");
    },
  });

  const handleSubmit = (data: CitaMedica) => {
    createMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Citas</h1>
          <p className="text-muted-foreground mt-1">
            Agenda y confirma citas médicas
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Agendar Cita
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CitaTable citas={citas} pacientes={pacientes} profesionales={profesionales} />
        </motion.div>
      )}

      <CitaForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
        pacientes={pacientes}
        profesionales={profesionales}
      />
    </div>
  );
}
