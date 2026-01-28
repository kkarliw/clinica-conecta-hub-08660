import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getPacientes } from "@/lib/api";
import { buscarPacienteRapido } from "@/services/recepcionista.service";
import PacienteTable from "@/components/pacientes/PacienteTable";
import { motion } from "framer-motion";
import type { Paciente } from "@/types";

export default function RecepcionistaPacientes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([]);

  const { data: pacientes = [], isLoading } = useQuery({
    queryKey: ["pacientes"],
    queryFn: getPacientes,
  });

  // Búsqueda en tiempo real
  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    
    if (term.trim() === "") {
      setFilteredPacientes(pacientes);
      return;
    }

    // Búsqueda local primero (rápida)
    const localResults = pacientes.filter(p =>
      p.nombre?.toLowerCase().includes(term.toLowerCase()) ||
      p.numeroDocumento?.toLowerCase().includes(term.toLowerCase())
    );

    setFilteredPacientes(localResults);

    // TODO: Cuando exista el endpoint de búsqueda en backend, usarlo
    // const resultados = await buscarPacienteRapido(term);
    // setFilteredPacientes(resultados);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Búsqueda de Pacientes</h1>
          <p className="text-muted-foreground mt-1">
            Encuentra información rápida de pacientes
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o documento..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
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
          <PacienteTable pacientes={searchTerm ? filteredPacientes : pacientes} />
        </motion.div>
      )}
    </div>
  );
}
