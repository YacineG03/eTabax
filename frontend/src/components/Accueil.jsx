import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import workerImage from "../assets/chef.jpg";

const roles = [
  {
    key: "client",
    label: "VOUS ÊTES UN PARTICULIER ?",
    description:
      "Inscrivez-vous en tant que CLIENT pour avoir une main mise sur votre chantier, vos besoins en approviossnement et le personnel.",
    color: "#ffd9665e",
  },
  {
    key: "fournisseur",
    label: "UN FOURNISSEUR ALORS ?",
    description:
      "Vous voulez un espace adapté pour vendre vos produits et gérer les commandes et livraison ? Vous êtes au bon endroit!. Inscrivez-vous en tant que fournisseur et devenez le N°1 dans le marché.",
    color: "#F4B400",
  },
  {
    key: "chef-projet",
    label: "UN CHEF DE PROJET ?",
    description:
      "Si vous voulez administrer tout un chantier sans problème ou si vous souhaitez vous faire connaître dans le milieu inscrivez-vous comme chef de projet.",
    color: "#939990ff",
  },
];

function Accueil({ onNavigate }) {
  const handleRoleClick = (role) => {
    onNavigate("register");
    localStorage.setItem("registerRole", role);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "32px 48px 0 48px",
          backgroundColor: "#fff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={logo}
            alt="E-TABAX Logo"
            style={{ height: 48, marginRight: 16 }}
          />
          <span style={{ fontWeight: "bold", fontSize: 18, color: "#333" }}>
            E TABAX.
          </span>
        </div>
        <button
          style={{
            background: "#222",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "10px 24px",
            fontWeight: "bold",
            cursor: "pointer",
            hover: "background: #ffd966",
          }}
          onClick={() => onNavigate("login")}
        >
          Connexion
        </button>
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          gap: 10,
          backgroundColor: "#d3d2cd56",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 36,
              fontWeight: "bold",
              letterSpacing: "0.6em",
              marginBottom: 32,
              marginTop: 32,
              color: "#ffd966",
              textAlign: "center",
              textTransform: "uppercase",
              fontFamily: "helvetica, sans-serif",
            }}
          >
            TABAX SUNU REW
          </h1>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {roles.map((role) => (
              <div
                key={role.key}
                onClick={() => handleRoleClick(role.key)}
                style={{
                  background: role.color,
                  color: "#444",
                  borderRadius: 24,
                  padding: "20px 32px",
                  boxShadow: "0 2px 8px rgba(221, 115, 115, 0.07)",
                  cursor: "pointer",
                  //   display: 'flex',
                  left: 30,
                  alignItems: "center",
                  transition: "transform 0.15s",
                  border: "2px solid #eee",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.03)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                {/* <span style={{
                  fontSize: 36,
                  marginRight: 2
                }}>{role.icon}</span> */}
                <div>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: 25,
                      marginBottom: 8,
                    }}
                  >
                    {role.label}
                  </div>
                  <div style={{ color: "#494948ff", fontSize: 15 }}>
                    {role.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div
            style={{
              position: "relative",
              width: 500,
              height: 500,
              left: 30,
              top: 50,
              //   background: '#ffd966',
              //   boxShadow: '0 4px 24px rgba(0,0,0,0.13)',
              overflow: "hidden",
            }}
          >
            <img
              src={workerImage}
              alt="Ouvrier avec plans"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "100%",
                height: "auto",
              }}
            />
            {/* <img
                src={schemaImage}
                alt="Schéma de chantier"
                style={{
                position: 'relative',
                bottom: 100,
                right: 68,
                width: '100%',
                height: 'auto',
                opacity: 0.8,
                
                }}
            /> */}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Accueil;
