import { test } from 'node:test';
import assert from 'node:assert';
import { generateSlug, formatRupiah, buildHierarchy, FlatNode } from './utils';

test('generateSlug utility', () => {
  // Test case 1: Basic title
  assert.strictEqual(
    generateSlug('Kerja Bakti Massal Sambeng'),
    'kerja-bakti-massal-sambeng'
  );

  // Test case 2: Title with special characters and uppercase
  assert.strictEqual(
    generateSlug('Program KKN 2026: Pemberdayaan UMKM!!!'),
    'program-kkn-2026-pemberdayaan-umkm'
  );

  // Test case 3: Title with multiple spaces and leading/trailing spaces
  assert.strictEqual(
    generateSlug('  Berita  Keren  Sambeng  '),
    'berita-keren-sambeng'
  );
});

test('formatRupiah utility', () => {
  // Test case 1: Standard price formatting
  assert.strictEqual(formatRupiah(15000), 'Rp 15.000');

  // Test case 2: Million amount formatting
  assert.strictEqual(formatRupiah(1250000), 'Rp 1.250.000');

  // Test case 3: Zero amount
  assert.strictEqual(formatRupiah(0), 'Rp 0');
});

test('buildHierarchy utility', () => {
  // Test case flat hierarchy array
  const flatNodes: FlatNode[] = [
    { id: '1', parentId: null, name: 'Dukuh (Root)' },
    { id: '2', parentId: '1', name: 'Sekretaris (Child 1)' },
    { id: '3', parentId: '1', name: 'Bendahara (Child 2)' },
    { id: '4', parentId: '2', name: 'Staf Sekretariat (Grandchild)' },
    { id: '5', parentId: '99', name: 'Orphan Node' }, // parent id doesn't exist
  ];

  const tree = buildHierarchy(flatNodes);

  // Assert root nodes count (Root + Orphan Node)
  assert.strictEqual(tree.length, 2);

  // Assert Root node info
  const root = tree[0];
  assert.strictEqual(root.id, '1');
  assert.strictEqual(root.children.length, 2);

  // Assert Child 1 info
  const child1 = root.children[0];
  assert.strictEqual(child1.id, '2');
  assert.strictEqual(child1.children.length, 1);

  // Assert Grandchild info
  const grandchild = child1.children[0];
  assert.strictEqual(grandchild.id, '4');
  assert.strictEqual(grandchild.children.length, 0);

  // Assert Orphan Node info
  const orphan = tree[1];
  assert.strictEqual(orphan.id, '5');
  assert.strictEqual(orphan.children.length, 0);
});
