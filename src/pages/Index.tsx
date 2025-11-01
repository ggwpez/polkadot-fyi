import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

interface AbbreviationEntry {
  abbreviation: string;
  title: string;
}

export default function Index() {
  const navigate = useNavigate();
  const [abbreviations, setAbbreviations] = useState<AbbreviationEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Fetch abbreviations on mount, no wallet required for reading
    fetchAbbreviations();
  }, []);

  const getContract = async () => {
    // For read operations, use public RPC provider
    const publicProvider = new ethers.JsonRpcProvider(PASEO_ASSET_HUB.rpcUrls[0]);
    return new ethers.Contract(CONTRACT_ADDRESS, entryRegistryABI, publicProvider);
  };

  const fetchAbbreviations = async () => {
    setLoading(true);
    try {
      console.log("Fetching abbreviations...");
      const contract = await getContract();
      const allAbbreviations = await contract.getAllAbbreviations();
      console.log("Abbreviations:", allAbbreviations);

      // Fetch title for each abbreviation
      const entriesWithTitles = await Promise.all(
        allAbbreviations.map(async (abbr: string) => {
          try {
            const [title] = await contract.getEntry(abbr);
            return { abbreviation: abbr, title };
          } catch (err) {
            console.error(`Error fetching title for ${abbr}:`, err);
            return { abbreviation: abbr, title: "" };
          }
        })
      );

      setAbbreviations(entriesWithTitles);
    } catch (err: any) {
      console.error("Error fetching abbreviations:", err);
      setError(`Failed to fetch abbreviations: ${err.message || err.toString()}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-8 max-w-3xl">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Index</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="grid gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="text-center p-4 rounded-lg border border-white/10 bg-white/5"
                  >
                    <div className="flex flex-col gap-1 items-center">
                      <div className="h-7 w-24 bg-white/10 animate-pulse rounded mx-auto" />
                      <div className="h-5 w-48 bg-white/10 animate-pulse rounded mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            ) : abbreviations.length === 0 ? (
              <p className="text-gray-400">No abbreviations found.</p>
            ) : (
              <div className="grid gap-2">
                {abbreviations.map((entry) => (
                  <button
                    key={entry.abbreviation}
                    onClick={() => navigate(`/${entry.abbreviation}`)}
                    className="text-center p-4 rounded-lg border border-white/10 hover:border-blue-500/50 hover:bg-white/5 transition-all"
                  >
                    <div className="flex flex-col gap-1 items-center">
                      <span className="text-[var(--color-polkadot-pink)] font-semibold text-lg">{entry.abbreviation}</span>
                      {entry.title && <span className="text-white/70 text-sm">{entry.title}</span>}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
