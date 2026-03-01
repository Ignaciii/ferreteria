package ignacio.appFerreteria.service;

import org.springframework.stereotype.Service;
import ignacio.appFerreteria.model.Venta;
import ignacio.appFerreteria.repository.VentaRepository;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VentaService {

    private final VentaRepository ventaRepository;

    public Venta buscarVentaPorId(Long id) {
        return ventaRepository.findById(id).orElse(null);
    }

    public List<Venta> listarVentas() {
        return ventaRepository.findAll();
    }

    public void borrarVenta(Long id) {
        ventaRepository.deleteById(id);
    }

    public Venta guardarVenta(Venta venta) {
        venta.setFecha(LocalDateTime.now());
        return ventaRepository.save(venta);
    }

    public List<Venta> buscarEntreFechas(LocalDateTime inicio, LocalDateTime fin) {
        return ventaRepository.findByFechaBetween(inicio, fin);
    }
}
