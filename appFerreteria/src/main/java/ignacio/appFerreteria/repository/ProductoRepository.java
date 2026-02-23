package ignacio.appFerreteria.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ignacio.appFerreteria.model.Producto;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

}
