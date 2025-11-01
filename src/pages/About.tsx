import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";

export default function About() {
  return (
    <div className="container mx-auto px-6 py-8 space-y-8 max-w-3xl">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>About Polkadot FYI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">What is this?</h3>
            <p className="text-white/90 leading-relaxed">
              Polkadot FYI is a decentralized abbreviation registry built on the Paseo Asset Hub testnet.
              It allows users to create and share definitions for common abbreviations and terminology
              used in the Polkadot ecosystem.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-3">Network Information</h3>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2">
              <p className="text-white/90">
                <span className="font-semibold">Network:</span> Paseo Asset Hub
              </p>
              <p className="text-white/90">
                <span className="font-semibold">Chain ID:</span> 420420422 (0x190f1b46)
              </p>
              <p className="text-white/90">
                <span className="font-semibold">RPC URL:</span>{" "}
                <span className="text-xs break-all">https://testnet-passet-hub-eth-rpc.polkadot.io</span>
              </p>
              <p className="text-white/90">
                <span className="font-semibold">Explorer:</span>{" "}
                <a
                  href="https://blockscout-passet-hub.parity-testnet.parity.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-xs break-all"
                >
                  blockscout-passet-hub.parity-testnet.parity.io
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
