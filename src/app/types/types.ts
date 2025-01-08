export type { Achado } from '@/types/findings'

export type Estudo = {
  id: string
  nome: string
  imagens: Imagem[]
  status: string
  laudoId: string | null
}

export type Imagem = {
  id: string
  link: string
}

export type Laudo = {
  id: string
  medico: Medico
}

export type Medico = {
  id: string
  nome: string
  avatar: string
}
