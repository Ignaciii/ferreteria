package ignacio.appFerreteria.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String codigo;

    private String nombre;

    private String unidadMedida;

    private Double puntoReposicion;
    private Double stockActual;

    private LocalDate fechaUltimaVenta;
    private LocalDate fechaUltimaCompra;

    private Double precioPublico;
    private Double precioCosto;
}
