import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import {
  CONTRACT_ADDRESS,
  entryRegistryABI,
  PASEO_ASSET_HUB,
} from "../config/contract";
import { parseHashtags } from "../utils/textParser";

export default function AbbreviationDetail() {
  const { abbreviation } = useParams<{ abbreviation: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    // Fetch abbreviation on mount, no wallet required for reading
    if (abbreviation) {
      fetchAbbreviation();
    }
  }, [abbreviation]);

  const getContract = async () => {
    // For read operations, use public RPC provider
    const publicProvider = new ethers.JsonRpcProvider(PASEO_ASSET_HUB.rpcUrls[0]);
    return new ethers.Contract(CONTRACT_ADDRESS, entryRegistryABI, publicProvider);
  };

  const fetchAbbreviation = async () => {
    if (!abbreviation) return;

    setLoading(true);
    setError("");
    setNotFound(false);

    try {
      const upperAbbreviation = abbreviation.toUpperCase();
      console.log(`Fetching abbreviation: ${upperAbbreviation}`);
      const contract = await getContract();

      // Check if entry exists
      const exists = await contract.entryExists(upperAbbreviation);

      if (!exists) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const [entryTitle, entryDescription] = await contract.getEntry(upperAbbreviation);
      setTitle(entryTitle);
      setDescription(entryDescription);
    } catch (err: any) {
      console.error("Error fetching abbreviation:", err);
      setError(`Failed to fetch abbreviation: ${err.message || err.toString()}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8 space-y-8 max-w-3xl">
        <Card>
          <CardHeader className="text-center">
            <div className="flex flex-col items-center justify-center">
              <CardTitle className="text-3xl mb-2">
                <div className="h-9 w-32 bg-white/10 animate-pulse rounded mx-auto" />
              </CardTitle>
              <div className="h-7 w-48 bg-white/10 animate-pulse rounded" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="h-4 bg-white/10 animate-pulse rounded w-full" />
                <div className="h-4 bg-white/10 animate-pulse rounded w-full" />
                <div className="h-4 bg-white/10 animate-pulse rounded w-3/4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="container mx-auto px-6 py-8 max-w-3xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Abbreviation Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4 text-white/90">
              The abbreviation "{abbreviation}" does not exist in the registry.
            </p>
            <Button variant="gradient" onClick={() => navigate("/")} className="mx-auto">
              Back to Index
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-8 max-w-3xl">
      <Card>
        <CardHeader className="text-center">
          <div className="flex flex-col items-center justify-center">
            <CardTitle className="text-3xl text-[var(--color-polkadot-pink)] mb-2">
              {abbreviation}
            </CardTitle>
            <h2 className="text-xl font-semibold text-white">{title}</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-white/90 leading-relaxed">{parseHashtags(description)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card>
          <CardContent className="py-4">
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
