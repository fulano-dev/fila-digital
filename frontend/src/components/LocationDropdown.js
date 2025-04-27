import React, { useEffect, useState } from 'react';
import Select from 'react-select'; // Certificando-se de importar o Select
import { useLayout } from '../context/LayoutContext'; // Importando o contexto

const LocationDropdown = ({ locations, selectedLocation, onLocationChange, branches, 
    children, 
  corPrincipal, 
  corSecundaria, 
  corTercearia, 
  corNome, 
  corFonte, 
  corFonteSecundaria
 }) => {
  const { layoutConfig } = useLayout();  // Usando o hook do LayoutContext para acessar as cores

  // Estado para armazenar as filiais filtradas
  const [filteredBranches, setFilteredBranches] = useState([]);

  // Garantir que branches seja um array válido
  useEffect(() => {
    if (Array.isArray(branches)) {
      setFilteredBranches(branches);
    } else {
      setFilteredBranches([]); // Se branches não for válido, inicializar como um array vazio
    }
  }, [branches]);

  // Filtrar filiais sempre que a localização mudar
  useEffect(() => {
    if (selectedLocation && Array.isArray(branches)) {
      const filtered = branches.filter(branch => branch.Localizacao === selectedLocation.label);
      setFilteredBranches(filtered);
    } else {
      setFilteredBranches(branches); // Se não houver localização selecionada, retorna todas as filiais
    }
  }, [selectedLocation, branches]);


  // Filtrando e garantindo que localizações duplicadas não sejam exibidas
  const uniqueLocations = Array.from(new Set(locations.map(loc => loc.idLocalizacao)))
    .map(id => locations.find(loc => loc.idLocalizacao === id)); // Filtra locais duplicados pelo id

  const locationOptions = uniqueLocations.map(loc => ({
    value: loc.idLocalizacao,
    label: loc.localizacao,
  }));

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', margin: '20px 0' }}>
      <Select
        options={locationOptions}
        value={selectedLocation}
        onChange={onLocationChange}
        placeholder="Selecione uma cidade."
        isClearable
        styles={{
          control: (base) => ({
            ...base,
            padding: '14px 20px',
            fontSize: '1.5rem',
            borderRadius: '15px',
            border: `2px solid ${corSecundaria}`,
            backgroundColor: 'transparent',
            width: '100%',
            maxWidth: '400px',
            minWidth: '400px !important',
            boxShadow: `0 6px 20px rgba(0, 0, 0, 0.1)`,
            fontWeight: '600',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: corTercearia,
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
            },
          }),
          menu: (base) => ({
            ...base,
            boxShadow: `0 6px 20px rgba(0, 0, 0, 0.1)`,
            borderRadius: '12px',
            backgroundColor: '#fff',
            maxHeight: '300px',
            overflowY: 'auto',
            padding: '5px 0',
          }),
          option: (provided, state) => ({
            ...provided,
            padding: '12px 20px',
            fontSize: '1.4rem',
            color: corFonteSecundaria,
            backgroundColor: state.isSelected ? corTercearia : state.isFocused ? '#e0e0e0' : 'transparent',
            borderRadius: '10px',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
          }),
          singleValue: (base) => ({
            ...base,
            fontSize: '1.4rem',
            color: corFonteSecundaria,
          }),
          placeholder: (base) => ({
            ...base,
            fontSize: '1.4rem',
            color: '#bbb',
          }),
        }}
      />
    </div>
  );
};

export default LocationDropdown;