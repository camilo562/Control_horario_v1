CREATE DATABASE IF NOT EXISTS control_horario
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE control_horario;

CREATE TABLE IF NOT EXISTS registros_horarios (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  empleado VARCHAR(120) NOT NULL,
  tipo ENUM('entrada', 'salida') NOT NULL,
  fecha_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_registros_fecha_hora (fecha_hora)
);
