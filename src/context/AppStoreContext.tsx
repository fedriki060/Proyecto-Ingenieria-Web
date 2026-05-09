import {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
  type ReactNode,
} from 'react';
import { salasApi, reservasApi } from '../services/api';

interface Sala {
  id: number;
  nombre: string;
  descripcion: string;
  capacidad: number;
  ubicacion: string;
  tipo: string;
  imagenUrl?: string;
  disponible: boolean;
  requiereAprobacion: boolean;
}

interface Reserva {
  id: number;
  usuarioId: string;
  nombreUsuario: string;
  salaId: number;
  nombreSala: string;
  fechaInicio: string;
  fechaFin: string;
  proposito: string;
  estado: string;
  comentarioStaff?: string;
  fechaCreacion: string;
}

interface AppStoreContextType {
  salas: Sala[];
  reservas: Reserva[];
  isLoading: boolean;
  cargarSalas: () => Promise<void>;
  cargarReservas: () => Promise<void>;
  crearReserva: (salaId: number, fechaInicio: string, fechaFin: string, proposito: string) => Promise<Reserva>;
  cambiarEstadoReserva: (id: number, estado: string, comentario?: string) => Promise<void>;
  cancelarReserva: (id: number) => Promise<void>;
  registrarNoShow: (id: number) => Promise<void>;
  cargarTodasReservas: () => Promise<void>;
  todasReservas: Reserva[];
}

export const AppStoreContext = createContext<AppStoreContextType>({} as AppStoreContextType);

export function useAppStore() {
  return useContext(AppStoreContext);
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [todasReservas, setTodasReservas] = useState<Reserva[]>([]);

  const cargarTodasReservas = useCallback(async () => {
    try {
        setIsLoading(true);
        const data = await reservasApi.getAll();
        setTodasReservas(data);
    } catch (error) {
        console.error('Error cargando todas las reservas:', error);
    } finally {
        setIsLoading(false);
    }
    }, []);

  const cargarSalas = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await salasApi.getAll();
      setSalas(data);
    } catch (error) {
      console.error('Error cargando salas:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cargarReservas = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await reservasApi.getMias();
      setReservas(data);
    } catch (error) {
      console.error('Error cargando reservas:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const crearReserva = useCallback(async (
    salaId: number,
    fechaInicio: string,
    fechaFin: string,
    proposito: string
  ): Promise<Reserva> => {
    setIsLoading(true);
    try {
      const nueva = await reservasApi.create({ salaId, fechaInicio, fechaFin, proposito });
      setReservas(prev => [...prev, nueva]);
      return nueva;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cambiarEstadoReserva = useCallback(async (
    id: number,
    estado: string,
    comentario?: string
  ) => {
    setIsLoading(true);
    try {
      const actualizada = await reservasApi.cambiarEstado(id, estado, comentario);
      setReservas(prev => prev.map((r: Reserva) => r.id === id ? actualizada : r));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelarReserva = useCallback(async (id: number) => {
    setIsLoading(true);
    try {
      await reservasApi.cancelar(id);
      await cargarReservas();
    } finally {
      setIsLoading(false);
    }
  }, [cargarReservas]);

  const registrarNoShow = useCallback(async (id: number) => {
    setIsLoading(true);
    try {
      await reservasApi.registrarNoShow(id);
      setReservas(prev => prev.map((r: Reserva) =>
        r.id === id ? { ...r, estado: 'NoShow' } : r
      ));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarSalas();
  }, [cargarSalas]);

  return (
    <AppStoreContext.Provider value={{
      salas,
      reservas,
      isLoading,
      cargarSalas,
      cargarReservas,
      crearReserva,
      cambiarEstadoReserva,
      cancelarReserva,
      registrarNoShow,
      todasReservas,
      cargarTodasReservas,
    }}>
      {children}
    </AppStoreContext.Provider>
  );
}