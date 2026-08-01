import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Tag, ExternalLink, ShieldCheck, Star } from 'lucide-react';

export default async function PublicDealPage({ params }: { params: { slug: string } }) {
  // Buscar produto ou snapshot relacionado ao slug da oferta
  const products = await prisma.product.findMany({
    take: 1,
    include: { affiliatePlatform: true },
  });

  const product = products[0];

  if (!product) {
    return notFound();
  }

  const savings = product.previousPrice && product.previousPrice > product.currentPrice
    ? (product.previousPrice - product.currentPrice).toFixed(2)
    : null;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans p-6 md:p-12 max-w-4xl mx-auto space-y-8">
      {/* Badge da Oferta */}
      <div className="flex items-center gap-2">
        <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5" />
          <span>Oferta Verificada</span>
        </span>
        <span className="text-xs text-gray-500">{product.affiliatePlatform.name}</span>
      </div>

      {/* Título & Preço */}
      <div className="space-y-4">
        <h1 className="text-2xl md:text-4xl font-extrabold text-gray-100 leading-tight">
          {product.title}
        </h1>

        <div className="flex items-baseline gap-4">
          <span className="text-3xl md:text-5xl font-black text-emerald-400">
            R$ {product.currentPrice.toFixed(2)}
          </span>
          {product.previousPrice && (
            <span className="text-lg text-gray-500 line-through">
              R$ {product.previousPrice.toFixed(2)}
            </span>
          )}
          {savings && (
            <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-2 py-1 rounded">
              Economize R$ {savings}
            </span>
          )}
        </div>
      </div>

      {/* Avaliações */}
      {product.rating && (
        <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
          <Star className="w-4 h-4 fill-amber-400" />
          <span>{product.rating} / 5</span>
          <span className="text-gray-500">({product.reviewCount || 0} avaliações de compradores)</span>
        </div>
      )}

      {/* Imagem do Produto */}
      {product.imageUrl && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center justify-center max-h-[350px]">
          <img src={product.imageUrl} alt={product.title} className="max-h-[300px] object-contain rounded-lg" />
        </div>
      )}

      {/* Descrição */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 space-y-3">
        <h2 className="text-sm font-bold uppercase text-gray-300 tracking-wider">Descrição e Detalhes</h2>
        <p className="text-xs text-gray-300 leading-relaxed">
          {product.description || `Confira a oferta imperdível do ${product.title} com garantia oficial e suporte do fabricante.`}
        </p>
      </div>

      {/* Chamada para Ação / Botão de Compra */}
      <div className="space-y-4 pt-4 border-t border-gray-800">
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base py-4 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/20 transition-all"
        >
          <span>Ir Para a Loja Oficial & Garantir Oferta</span>
          <ExternalLink className="w-5 h-5" />
        </a>

        {/* Transparência Legal */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>#ad #afiliado — Ao comprar através do nosso link parceiro, podemos receber uma comissão sem custo adicional para você.</span>
        </div>
      </div>
    </div>
  );
}
