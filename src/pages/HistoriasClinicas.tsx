import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import type { HistoriaClinica } from "@/types";
import HistoriaClinicaTable from "@/components/historias/HistoriaClinicaTable";
import HistoriaClinicaForm from "@/components/historias/HistoriaClinicaForm";
import { getHistoriasClinicas, createHistoriaClinica, getPacientes, getProfesionales } from "@/lib/api";

export default function HistoriasClinicas() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: historias = [], isLoading } = useQuery({
    queryKey: ["historias-clinicas"],
    queryFn: getHistoriasClinicas,
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
    mutationFn: createHistoriaClinica,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["historias-clinicas"] });
      setIsFormOpen(false);
      toast.success("Historia clínica creada exitosamente");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error al crear historia clínica");
    },
  });

  const handleSubmit = (data: HistoriaClinica) => {
    createMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Historias Clínicas</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona historias clínicas, diagnósticos y tratamientos
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva Historia
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <HistoriaClinicaTable 
            historias={historias} 
            pacientes={pacientes}
            profesionales={profesionales}
          />
        </motion.div>
      )}

      <HistoriaClinicaForm
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
