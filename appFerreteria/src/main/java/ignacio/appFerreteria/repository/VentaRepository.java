package ignacio.appFerreteria.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import ignacio.appFerreteria.model.Venta;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {

    public List<Venta> findByFechaBetween(LocalDateTime inicio, LocalDateTime fin);
}
