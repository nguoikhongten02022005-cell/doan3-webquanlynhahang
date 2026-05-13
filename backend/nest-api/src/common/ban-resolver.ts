import { MySqlService } from '../database/mysql/mysql.service';

/**
 * Resolve MaBan from user input. Single-query fallback chain:
 *   - exact MaBan match
 *   - normalized MaBan match (pad prefix + 3 digits)
 *   - SoBan lookup (numeric input)
 * "B01" → "B001", "1" → "B001", "B001" → "B001".
 */
export async function resolveMaBan(
  mysql: MySqlService,
  giaTri: string,
): Promise<string | null> {
  if (!giaTri) return null;

  const trimmed = giaTri.trim();
  const normalized = normalizeMaBan(trimmed);
  const so = Number(trimmed);
  const soNumeric = Number.isFinite(so) && so > 0 ? so : null;

  const rows = await mysql.truyVan(
    `SELECT MaBan FROM Ban
     WHERE MaBan = ?
        OR (MaBan = ? AND ? IS NOT NULL)
        OR (SoBan = ? AND ? IS NOT NULL)
     LIMIT 1`,
    [trimmed, normalized, normalized, soNumeric, soNumeric],
  );

  return rows.length > 0 ? rows[0].MaBan : null;
}

/**
 * Normalize: "B01" → "B001", "B1" → "B001", "b001" → "B001".
 */
export function normalizeMaBan(input: string): string | null {
  const match = input.match(/^([A-Za-z]+)(\d+)$/);
  if (!match) return null;
  const prefix = match[1].toUpperCase();
  const num = match[2].padStart(3, '0');
  return `${prefix}${num}`;
}
