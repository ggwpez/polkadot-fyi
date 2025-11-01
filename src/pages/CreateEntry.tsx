import { ethers } from "ethers";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Input, Textarea } from "../components/ui/Input";
import {
  CONTRACT_ADDRESS,
  entryRegistryABI,
  PASEO_ASSET_HUB,
} from "../config/contract";
import { useMetaMask } from "../hooks/useMetaMask";
import { parseHashtags } from "../utils/textParser";

export default function CreateEntry() {
  const navigate = useNavigate();
  const { connected, chainId } = useMetaMask();
  const [abbreviation, setAbbreviation] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const isCorrectNetwork = chainId === PASEO_ASSET_HUB.chainId;

  const switchToPaseoAssetHub = async () => {
    if (!(window as any).ethereum) {
      setError("MetaMask not detected in this browser");
      return;
    }

    try {
      await (window as any).ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: PASEO_ASSET_HUB.chainId }],
      });
      setError("");
    } catch (switchError: any) {
      if (switchError?.code === 4902) {
        try {
          await (window as any).ethereum.request({
            method: "wallet_addEthereumChain",
            params: [PASEO_ASSET_HUB],
          });
          setError("");
        } catch (addError: any) {
          console.error("Failed to add chain to MetaMask:", addError);
          setError(
            `Failed to add network to MetaMask: ${
              addError?.message || addError
            }`
          );
        }
      } else {
        console.error("Failed to switch network:", switchError);
        setError(
          `Failed to switch network: ${switchError?.message || switchError}`
        );
      }
    }
  };

  const getProvider = () => {
    if (!(window as any).ethereum) {
      throw new Error("MetaMask not detected.");
    }
    return new ethers.BrowserProvider((window as any).ethereum);
  };

  const getContract = async (withSigner = false) => {
    if (withSigner) {
      // For write operations, require MetaMask
      const provider = getProvider();
      const signer = await provider.getSigner();
      return new ethers.Contract(CONTRACT_ADDRESS, entryRegistryABI, signer);
    }
    // For read operations, use public RPC provider
    const publicProvider = new ethers.JsonRpcProvider(PASEO_ASSET_HUB.rpcUrls[0]);
    return new ethers.Contract(CONTRACT_ADDRESS, entryRegistryABI, publicProvider);
  };

  const handleAddEntry = async () => {
    if (!connected) {
      setError("Please connect your MetaMask wallet to add entries");
      return;
    }

    if (!isCorrectNetwork) {
      setError("Please switch to Paseo Asset Hub network");
      return;
    }

    if (!abbreviation.trim() || !title.trim() || !description.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (abbreviation.length < 2) {
      setError("Abbreviation must be at least 2 characters");
      return;
    }

    if (title.length < 3) {
      setError("Title must be at least 3 characters");
      return;
    }

    if (description.length < 3) {
      setError("Description must be at least 3 characters");
      return;
    }

    setLoading(true);
    setError("");
    try {
      console.log("Adding entry...");
      const contract = await getContract(true);
      const upperAbbreviation = abbreviation.toUpperCase();

      console.log(
        `Adding entry: ${upperAbbreviation} - ${title}`
      );
      const tx = await contract.addEntry(upperAbbreviation, title, description);

      console.log("Transaction sent:", tx.hash);
      await tx.wait();
      console.log("Transaction confirmed");

      setAbbreviation("");
      setTitle("");
      setDescription("");

      // Navigate to the index page after successful creation
      navigate("/");
    } catch (err: any) {
      console.error("Error adding entry:", err);
      setError(`Failed to add entry: ${err.message || err.toString()}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-8 max-w-3xl">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Add New Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 max-w-sm mx-auto">
            <Input
              placeholder="Abbreviation (e.g., DOT)"
              value={abbreviation}
              onChange={(e) => {
                // Only allow uppercase ASCII letters, max 10 characters
                const value = e.target.value
                  .toUpperCase()
                  .replace(/[^A-Z]/g, '')
                  .slice(0, 10);
                setAbbreviation(value);
              }}
              disabled={!connected || loading}
              maxLength={10}
            />
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => {
                // Capitalize first letter of each word
                const value = e.target.value
                  .split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                  .join(' ');
                setTitle(value);
              }}
              disabled={!connected || loading}
              maxLength={100}
            />
            <div className="w-full">
              <Textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={!connected || loading}
                maxLength={1000}
                className="w-full"
              />
              {description && (
                <div className="mt-2 p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-gray-400 mb-1">Preview:</p>
                  <p className="text-white/90 text-sm leading-relaxed">{parseHashtags(description)}</p>
                </div>
              )}
            </div>
            <Button
              onClick={handleAddEntry}
              disabled={loading || !abbreviation || !title || !description}
              variant="default"
              className="w-auto px-6 py-2 text-sm mx-auto"
            >
              {loading ? "Adding..." : "Add Entry"}
            </Button>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
