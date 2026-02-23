package ignacio.appFerreteria.service;

import org.springframework.stereotype.Service;

import ignacio.appFerreteria.model.Producto;
import ignacio.appFerreteria.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepositorio;

    public Producto guardarProducto(Producto producto) {
        return productoRepositorio.save(producto);
    }

    public List<Producto> listarProductos() {
        return productoRepositorio.findAll();
    }

    public void borrarProducto(Long id) {
        productoRepositorio.deleteById(id);
    }

    public Producto buscarProductoPorId(Long id) {
        return productoRepositorio.findById(id).orElse(null);
    }

}
