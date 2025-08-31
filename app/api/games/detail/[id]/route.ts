// app/api/games/detail/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Mapeo de ligas (igual que en tu otro endpoint)
const LEAGUE_MAP: { [key: string]: string } = {
  MLB: "baseball/mlb",
  NFL: "football/nfl", 
  NBA: "basketball/nba",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Obtener la liga del query parameter
    const { searchParams } = new URL(request.url);
    const league = searchParams.get('league');
    
    if (!league) {
      return NextResponse.json(
        { success: false, error: "Missing league parameter" },
        { status: 400 }
      );
    }
    
    const leagueUpper = league.toUpperCase();
    const espnLeague = LEAGUE_MAP[leagueUpper];
    
    if (!espnLeague) {
      return NextResponse.json(
        { success: false, error: "League not found. Use NFL, NBA, or MLB" },
        { status: 400 }
      );
    }

    console.log(`Fetching ${leagueUpper} game details for ID: ${id}`);

    // URL dinámica para cualquier liga
    const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${espnLeague}/summary?event=${id}`, {
      next: { revalidate: 60 }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch game details. Status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: data,
      league: leagueUpper
    });

  } catch (error) {
    console.error('Error fetching game details:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch game details' 
      },
      { status: 500 }
    );
  }
}