import React from 'react';
import { FaDollarSign, FaUsers, FaShoppingCart } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';

interface Props {
  totalClientes: number;
  totalVendas: number;
  totalReceita: number;
}

const ResumoVendasPF: React.FC<Props> = ({ totalClientes, totalVendas, totalReceita }) => {
  const { temaAtual } = useTheme();

  const cards = [
    
  ];

  return (
  
  );
};

export default ResumoVendasPF;