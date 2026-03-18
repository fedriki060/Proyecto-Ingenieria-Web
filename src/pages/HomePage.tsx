import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import StateMessage from "../components/ui/StateMessage";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <StateMessage
        type="error"
        title="No autenticado"
        description="Por favor inicia sesión primero"
        actionText="Ir a Login"
        onAction={() => navigate("/login")}
      />
    );
  }

  const isAdmin = currentUser.role === "ADMIN";

  const cards = [
    {
      label: "Reservar Espacio",
      description: "Accede al calendario para reservar un espacio",
      path: "/spaces",
      img: "/Proyecto-Ingenieria-Web/images/calendario.jpeg",
      animation: "group-hover:[animation:panZoom_10s_linear_forwards]",
      objectPosition: "center center",
      icon: "📅",
    },
    {
      label: "Mis Reservas",
      description: "Ver historial de tus reservaciones",
      path: "/reservations",
      img: "https://res.cloudinary.com/myhq/image/upload/q_auto/w_1920/f_auto/workspaces/the-circlework-unitech-trade-centre/meeting-room/plans/14-seater/fw3ce8.jpg",
      animation: "group-hover:[animation:panZoom2_10s_linear_forwards]",
      objectPosition: "center center",
      icon: "📋",
    },
    ...(isAdmin
      ? [
          {
            label: "Administración",
            description: "Gestiona espacios y aprobaciones",
            path: "/admin",
            img: "/Proyecto-Ingenieria-Web/images/administrar.jpg",
            animation: "group-hover:[animation:panZoom3_10s_linear_forwards]",
            objectPosition: "45% center",
            icon: "⚙️",
          },
        ]
      : []),
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-4 flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-text mb-1">
          🏛️ Bienvenido a SalaFinder
        </h1>
        <p className="text-muted">
          Hola {currentUser.name} ({currentUser.role})
        </p>
      </div>

      <div
        className={`grid gap-4 ${
          isAdmin
            ? "grid-cols-1 md:grid-cols-3"
            : "grid-cols-1 md:grid-cols-2"
        }`}
      >
        {cards.map((card) => (
          <div
            key={card.path}
            onClick={() => navigate(card.path)}
            className="relative rounded-card overflow-hidden cursor-pointer
                       transform transition-all duration-700 ease-out shadow-card group
                       hover:scale-105 hover:-translate-y-2 hover:shadow-2xl"
            style={{ height: 'calc(100vh - 180px)' }}
          >
            <img
              src={card.img}
              alt={card.label}
              className={`absolute inset-0 h-full w-full object-cover ${card.animation}`}
              style={{ transformOrigin: card.objectPosition }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="relative z-10 p-8 flex flex-col justify-end h-full">
              <h2 className="text-xl font-bold text-white drop-shadow-lg mb-1">
                {card.icon} {card.label}
              </h2>
              <p className="text-sm text-white/80">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}