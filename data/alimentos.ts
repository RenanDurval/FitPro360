import { Alimento } from '../types';

export const CATEGORIAS_ALIMENTOS = [
  'Proteínas', 'Carboidratos', 'Vegetais', 'Frutas', 'Gorduras Boas', 'Laticínios', 'Grãos e Cereais', 'Bebidas',
];

export const ALIMENTOS: Alimento[] = [
  // ============ PROTEÍNAS ============
  { id: 'a001', nome: 'Frango (peito grelhado)', categoria: 'Proteínas', porcao: '100g', calorias: 165, proteina: 31, carboidrato: 0, gordura: 3.6, fibra: 0 },
  { id: 'a002', nome: 'Ovo Inteiro', categoria: 'Proteínas', porcao: '1 unidade (50g)', calorias: 72, proteina: 6.3, carboidrato: 0.4, gordura: 4.8, fibra: 0 },
  { id: 'a003', nome: 'Carne Bovina Magra', categoria: 'Proteínas', porcao: '100g', calorias: 198, proteina: 26, carboidrato: 0, gordura: 10, fibra: 0 },
  { id: 'a004', nome: 'Salmão', categoria: 'Proteínas', porcao: '100g', calorias: 208, proteina: 20, carboidrato: 0, gordura: 13, fibra: 0 },
  { id: 'a005', nome: 'Atum (em água)', categoria: 'Proteínas', porcao: '100g', calorias: 116, proteina: 26, carboidrato: 0, gordura: 0.8, fibra: 0 },
  { id: 'a006', nome: 'Tilápia', categoria: 'Proteínas', porcao: '100g', calorias: 128, proteina: 26, carboidrato: 0, gordura: 2.7, fibra: 0 },
  { id: 'a007', nome: 'Carne de Porco (lombo)', categoria: 'Proteínas', porcao: '100g', calorias: 143, proteina: 26, carboidrato: 0, gordura: 3.5, fibra: 0 },
  { id: 'a008', nome: 'Whey Protein', categoria: 'Proteínas', porcao: '30g (1 scoop)', calorias: 120, proteina: 24, carboidrato: 3, gordura: 1.5, fibra: 0 },

  // ============ CARBOIDRATOS ============
  { id: 'a010', nome: 'Arroz Branco', categoria: 'Carboidratos', porcao: '100g cozido', calorias: 130, proteina: 2.7, carboidrato: 28, gordura: 0.3, fibra: 0.4 },
  { id: 'a011', nome: 'Arroz Integral', categoria: 'Carboidratos', porcao: '100g cozido', calorias: 123, proteina: 2.7, carboidrato: 25.6, gordura: 1, fibra: 1.8 },
  { id: 'a012', nome: 'Batata Doce', categoria: 'Carboidratos', porcao: '100g', calorias: 86, proteina: 1.6, carboidrato: 20, gordura: 0.1, fibra: 3 },
  { id: 'a013', nome: 'Macarrão Integral', categoria: 'Carboidratos', porcao: '100g cozido', calorias: 124, proteina: 5.3, carboidrato: 25, gordura: 1.1, fibra: 3.2 },
  { id: 'a014', nome: 'Pão Integral', categoria: 'Carboidratos', porcao: '1 fatia (30g)', calorias: 69, proteina: 3.6, carboidrato: 11.9, gordura: 1.1, fibra: 1.9 },
  { id: 'a015', nome: 'Aveia', categoria: 'Carboidratos', porcao: '40g', calorias: 152, proteina: 5.3, carboidrato: 27, gordura: 2.7, fibra: 4 },
  { id: 'a016', nome: 'Mandioca', categoria: 'Carboidratos', porcao: '100g cozida', calorias: 125, proteina: 0.6, carboidrato: 30, gordura: 0.3, fibra: 1.8 },

  // ============ VEGETAIS ============
  { id: 'a020', nome: 'Brócolis', categoria: 'Vegetais', porcao: '100g', calorias: 34, proteina: 2.8, carboidrato: 7, gordura: 0.4, fibra: 2.6 },
  { id: 'a021', nome: 'Espinafre', categoria: 'Vegetais', porcao: '100g', calorias: 23, proteina: 2.9, carboidrato: 3.6, gordura: 0.4, fibra: 2.2 },
  { id: 'a022', nome: 'Tomate', categoria: 'Vegetais', porcao: '100g', calorias: 18, proteina: 0.9, carboidrato: 3.9, gordura: 0.2, fibra: 1.2 },
  { id: 'a023', nome: 'Cenoura', categoria: 'Vegetais', porcao: '100g', calorias: 41, proteina: 0.9, carboidrato: 10, gordura: 0.2, fibra: 2.8 },
  { id: 'a024', nome: 'Abobrinha', categoria: 'Vegetais', porcao: '100g', calorias: 17, proteina: 1.2, carboidrato: 3.1, gordura: 0.3, fibra: 1 },

  // ============ FRUTAS ============
  { id: 'a030', nome: 'Banana', categoria: 'Frutas', porcao: '1 unidade (120g)', calorias: 105, proteina: 1.3, carboidrato: 27, gordura: 0.4, fibra: 3.1 },
  { id: 'a031', nome: 'Maçã', categoria: 'Frutas', porcao: '1 unidade (180g)', calorias: 95, proteina: 0.5, carboidrato: 25, gordura: 0.3, fibra: 4.4 },
  { id: 'a032', nome: 'Morango', categoria: 'Frutas', porcao: '100g', calorias: 32, proteina: 0.7, carboidrato: 7.7, gordura: 0.3, fibra: 2 },
  { id: 'a033', nome: 'Abacate', categoria: 'Frutas', porcao: '100g', calorias: 160, proteina: 2, carboidrato: 8.5, gordura: 15, fibra: 7 },
  { id: 'a034', nome: 'Manga', categoria: 'Frutas', porcao: '100g', calorias: 60, proteina: 0.8, carboidrato: 15, gordura: 0.4, fibra: 1.6 },

  // ============ GORDURAS BOAS ============
  { id: 'a040', nome: 'Azeite de Oliva', categoria: 'Gorduras Boas', porcao: '1 colher (13ml)', calorias: 119, proteina: 0, carboidrato: 0, gordura: 13.5, fibra: 0 },
  { id: 'a041', nome: 'Castanha de Caju', categoria: 'Gorduras Boas', porcao: '30g', calorias: 157, proteina: 5.2, carboidrato: 8.6, gordura: 12.4, fibra: 1 },
  { id: 'a042', nome: 'Amendoim', categoria: 'Gorduras Boas', porcao: '30g', calorias: 170, proteina: 7, carboidrato: 4.6, gordura: 14.7, fibra: 2.5 },
  { id: 'a043', nome: 'Pasta de Amendoim', categoria: 'Gorduras Boas', porcao: '30g', calorias: 188, proteina: 8, carboidrato: 6, gordura: 16, fibra: 1.6 },

  // ============ LATICÍNIOS ============
  { id: 'a050', nome: 'Iogurte Natural', categoria: 'Laticínios', porcao: '170g', calorias: 100, proteina: 17, carboidrato: 6, gordura: 0.7, fibra: 0 },
  { id: 'a051', nome: 'Queijo Cottage', categoria: 'Laticínios', porcao: '100g', calorias: 98, proteina: 11, carboidrato: 3.4, gordura: 4.3, fibra: 0 },
  { id: 'a052', nome: 'Leite Desnatado', categoria: 'Laticínios', porcao: '200ml', calorias: 68, proteina: 6.8, carboidrato: 10, gordura: 0.2, fibra: 0 },
  { id: 'a053', nome: 'Queijo Minas', categoria: 'Laticínios', porcao: '30g', calorias: 79, proteina: 5, carboidrato: 0.7, gordura: 6.1, fibra: 0 },
];

export const getAlimentosPorCategoria = (categoria: string): Alimento[] =>
  ALIMENTOS.filter(a => a.categoria === categoria);
