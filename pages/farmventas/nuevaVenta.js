import React, { useEffect, useState, useRef, use } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { AutoComplete } from 'primereact/autocomplete';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import { listarMedicamentos,listarPacientes,registrar} from '../../services/apiVentas';


export const NuevaVenta = () => {
    let emptySale = {
        cantidad_vendida: 0,
        fecha_venta: null,
        total_venta: 0
    };

    const toast = useRef(null);
    const fileUploadRef = useRef(null);

    const [medicamentos, setMedicamentos] = useState([]);
    const [medicamento, setMedicamento] = useState([]);
    const [medicamentosDropdown, setMedicamentosDropdown] = useState([]);

    const [pacientes, setPacientes] = useState([]);
    const [filteredPacientes, setFilteredPacientes] = useState([]);
    const [selectedPaciente, setSelectedPaciente] = useState(null);

    const [venta, setVenta] = useState(emptySale);



    async function registrarVenta() {
        /*if (listboxValueM.id_mediamento != null &&
            venta.cantidad_vendida > 0 &&
            venta.fecha_venta != "" &&
            venta.total_venta > 0
            ) { */
            try {
                const response = await registrar(medicamento, venta.cantidad_vendida,pacientes,venta.fecha_venta,venta.total_venta);
                console.log(response);
                toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Venta agregada', life: 3000 });
                setVenta(emptySale);
                setMedicamento(null);
            } catch (error) {
                console.log(error);
            }
        /*} else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Complete todos los campos', life: 3000 });
        }*/
    }
    //cargar todas los medicamentos para seleccionar
    useEffect(()=>{
        async function obtenermedicamentos() {
            try {
                const medicine = await listarMedicamentos();
                console.log(medicine)
                setMedicamentos(medicine);

                const medicinedropdown = medicine.map(medicina => ({
                    label:medicina.nombre_medicamento,
                    medicina: medicina.id_medicamento
                }));
                console.log(medicinedropdown);
                setMedicamentosDropdown(medicinedropdown);
            }
            catch (error){
                console.log(error);
            }
        }
        obtenermedicamentos();
    }, []);

    //cargar todos los pacientes que esten disponibles
    useEffect(()=>{
        async function obtenerpacientes() {
            try {
                const pacient = await listarPacientes();
                console.log(pacient)
                

                const pacientedropdown = pacient.map(paciente => ({
                    nombre: `${paciente.nombres} ${paciente.apellidos}`,
                    ...paciente
                }));
                console.log(pacientedropdown);
                setPacientes(pacientedropdown);
            }
            catch (error){
                console.log(error);
            }
        }
        obtenerpacientes();
    }, []);

    useEffect(() => {
        async function obtenerPacienteID() {
            try {
                if (selectedPaciente) {
                    const infoPaciente = await mostrarPacienteID(selectedPaciente.id);
                    console.log(infoPaciente);

                    setInfoPaciente(infoPaciente);
                }
            } catch (error) {
                console.log(error);
            }
        }
        obtenerPacienteID();
    }, [selectedPaciente]);

    function buscarPaciente(event) {
        let filteredPacientes = [];

        if (event.query.trim().length) {
            filteredPacientes = pacientes.filter(paciente => paciente.nombre.toLowerCase().includes(event.query.toLowerCase()));
        } else {
            filteredPacientes = [...pacientes];
        }

        setFilteredPacientes(filteredPacientes);
    }


    const handleSubmit = async () => {
        console.log(venta);
        registrarVenta();
    };

    const onInputNumberChange = (e) => {
        const { name, value } = e.target;
        setVenta(prevSell => ({
            ...prevSell,
            [name]: parseFloat(value)
        }));
    };

    const onDateChange = (e) => {
        setVenta(prevSell => ({
            ...prevSell,
            fecha_venta: e.value
        }));
    };

    return (
        <div className='grid'>
            <Toast ref={toast}></Toast>
            <div className='col-12 md:col-12'>
                <div className='card p-fluid'>
                    <h5>Nueva Venta</h5>
                    
                    <div className="field">
                        <label htmlFor="medicamento">Productos Disponibles</label>
                        <Dropdown id='id_medicamento' value={medicamento} onChange={(e) => setMedicamento(e.value)} options={medicamentosDropdown} placeholder='Seleccione un Producto' filterPlaceholder='Buscar Productos Disponibles' filter/>
                    </div>

                    <div className="field">
                        <label htmlFor="cantidad_vendida">Cantidad del Producto Vendido</label>
                        <InputNumber id="cantidad_vendida" value={venta.cantidad_vendida} name="cantidad_vendida" onValueChange={onInputNumberChange} />
                    </div>

                    <div className="field">
                        <label htmlFor="nombre">Nombre del paciente</label>
                        <AutoComplete placeholder="Buscar" id="dd" dropdown value={selectedPaciente} onChange={(e) => setSelectedPaciente(e.value)} suggestions={filteredPacientes} completeMethod={buscarPaciente} field="nombre" />
                    </div>
                    
                    <div className="field">
                        <label htmlFor="fecha_venta">Fecha de Registro</label>
                        <Calendar id="fecha_venta" name="fecha_venta" value={venta.fecha_venta} onChange={onDateChange} showIcon />
                    </div>

                    <div className="field">
                        <label htmlFor="total_venta">Monto Total del Medicamento</label>
                        <InputNumber
                            id="total_venta"
                            value={venta.total_venta}
                            name="total_venta"
                            onValueChange={onInputNumberChange}
                            mode='currency'
                            currency='BOB'
                            locale='es-BO'
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="imagen">Opciones</label>
                        <span className="p-buttonset flex">
                            <Button
                                label="Guardar"
                                icon="pi pi-check"
                                onClick={handleSubmit}
                            />
                            <Button label="Limpiar" icon="pi pi-times" onClick={() => {
                                setVenta(emptySale);
                                setMedicamentosDropdown(null);
                                setSelectedPaciente(null);
                            }} />
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );
};
export default NuevaVenta;