package ignacio.appFerreteria.model;

import java.time.LocalDateTime;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor

public class Venta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime fecha;
    private Double subtotalBruto;
    private Double descuentoPorcentaje;
    private double totalNeto;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "venta_id")
    private List<DetalleVenta> detalles;

}
