'use client';
import Icon from './Icon';

export default function PrintButton({ label = 'Print or save as PDF' }: { label?: string }) {
  return (
    <button type="button" className="btn" onClick={() => window.print()}>
      <Icon name="print" className="arrow" />{label}
    </button>
  );
}
