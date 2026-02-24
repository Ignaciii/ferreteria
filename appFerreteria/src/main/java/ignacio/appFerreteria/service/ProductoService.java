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

    // en spring data el save tiene dos funciones, guardar y modificar en caso de
    // encontrar el guardado
    public Producto modificarProducto(Long id, Producto productoModificado) {
        Producto producto = buscarProductoPorId(id);
        if (producto != null && productoModificado != null) {
            producto.setCodigo(productoModificado.getCodigo());
            producto.setFechaUltimaCompra(productoModificado.getFechaUltimaCompra());
            producto.setFechaUltimaVenta(productoModificado.getFechaUltimaVenta());
            producto.setNombre(productoModificado.getNombre());
            producto.setPrecioCosto(productoModificado.getPrecioCosto());
            producto.setPrecioPublico(productoModificado.getPrecioPublico());
            producto.setStockActual(productoModificado.getStockActual());
            producto.setUnidadMedida(productoModificado.getUnidadMedida());

            return guardarProducto(producto);
        }
        return null;

    }

}
