const Pago = require('../../models/Pago');
const PDFDocument = require('pdfkit');
const path = require('path');

exports.crearPago = async (req, res) => {
  try {
    const nuevoPago = new Pago(req.body);
    await nuevoPago.save();
    res.status(201).json(nuevoPago);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear pago' });
  }
};

exports.obtenerPagos = async (req, res) => {
  try {
    const { dni } = req.query;
    let query = {};

    if (dni) {
      query['cliente.dni'] = dni;
    }

    const pagos = await Pago.find(query);
    res.json(pagos);
  } catch (error) {
    console.error('Error al obtener los pagos:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};


exports.buscarPorDNI = async (req, res) => {
  try {
    const { dni } = req.params;
    const pagos = await Pago.find({ 'cliente.dni': dni });
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar pagos' });
  }
};

exports.obtenerPagoPorId = async (req, res) => {
  try {
    const pago = await Pago.findById(req.params.id);
    if (!pago) {
      return res.status(404).json({ mensaje: 'Pago no encontrado' });
    }
    res.json(pago);
  } catch (error) {
    console.error('Error al buscar el pago por ID:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};


exports.descargarPDF = async (req, res) => {
  try {
    const pago = await Pago.findById(req.params.id);
    if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=comprobante_${pago._id}.pdf`);
    doc.pipe(res);

    doc.fontSize(18).text('Comprobante de Pago', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Fecha: ${new Date(pago.fechaPago).toLocaleDateString()}`);
    doc.text(`Periodo: ${pago.periodo}`);
    doc.text(`Forma de pago: ${pago.formaPago}`);
    doc.moveDown();

    doc.fontSize(14).text('Datos del Cliente');
    doc.fontSize(12).text(`Nombre: ${pago.cliente.nombre} ${pago.cliente.apellido}`);
    doc.text(`DNI: ${pago.cliente.dni}`);
    doc.text(`Email: ${pago.cliente.email}`);
    doc.text(`Teléfono: ${pago.cliente.telefono}`);
    doc.moveDown();

    doc.fontSize(14).text('Datos del Inmueble');
    doc.fontSize(12).text(`Dirección: ${pago.propiedad.direccion}`);
    doc.moveDown();

    doc.fontSize(14).text('Detalle del Pago');
    doc.fontSize(12).text(`Monto: $${pago.monto}`);
    if (pago.adicionales) doc.text(`Adicionales: ${pago.adicionales}`);

    doc.end();
  } catch (error) {
    res.status(500).json({ error: 'Error al generar el PDF' });
  }
};
