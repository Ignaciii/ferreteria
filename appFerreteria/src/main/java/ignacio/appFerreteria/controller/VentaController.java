package ignacio.appFerreteria.controller;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ignacio.appFerreteria.service.VentaService;
import lombok.RequiredArgsConstructor;
import ignacio.appFerreteria.model.Venta;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class VentaController {

    private final VentaService ventaService;

    @GetMapping()
    public List<Venta> getVentas(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {

        if (inicio != null && fin != null) {
            return ventaService.buscarEntreFechas(inicio, fin);
        }
        return ventaService.listarVentas();
    }

    @PostMapping
    public Venta guardarVenta(@RequestBody Venta venta) {
        return ventaService.guardarVenta(venta);

    }

}
