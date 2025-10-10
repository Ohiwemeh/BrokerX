import { useEffect, useState } from "react";

export default function CryptoPrices() {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const fetchPrices = async () => {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,cardano,binancecoin"
      );
      const data = await res.json();
      setCoins(data);
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="prices" className="bg-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-semibold mb-6">Live Crypto Prices</h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
          {coins.map((coin) => (
            <div
              key={coin.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              <div className="flex items-center gap-2 mb-2">
                <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                <h3 className="font-semibold">{coin.name}</h3>
              </div>
              <p className="text-gray-700">${coin.current_price.toLocaleString()}</p>
              <p
                className={`text-sm ${
                  coin.price_change_percentage_24h > 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {coin.price_change_percentage_24h.toFixed(2)}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
