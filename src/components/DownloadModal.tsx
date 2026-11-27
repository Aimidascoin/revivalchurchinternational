import React, { useState } from 'react';
import { Download, FileText, Check, HeartHandshake, BookOpen, MapPin } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { useToast } from './Toast';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  icon: typeof FileText;
  build: () => string;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose }) => {
  const { content } = useContent();
  const toast = useToast();
  const [downloaded, setDownloaded] = useState<string[]>([]);

  if (!isOpen) return null;

  const resources: Resource[] = [
    {
      id: 'welcome',
      title: 'New Believer Welcome Guide',
      description: 'A short guide to salvation, baptism and your next steps at RCI.',
      icon: BookOpen,
      build: () => [
        'RCI — NEW BELIEVER WELCOME GUIDE',
        '',
        'Welcome to the family!',
        '',
        '1. Salvation — receive Christ by faith and confess Him as Lord.',
        '2. Baptism — speak with your campus pastor about water baptism.',
        '3. Foundations 101 — join the next discipleship class.',
        '4. Family — connect with a revival group and serve on a team.',
        '',
        `Campuses: ${content.campuses.map((campus) => campus.name).join(', ')}`,
        'Contact: info@revivalchurchintl.org',
      ].join('\n'),
    },
    {
      id: 'campuses',
      title: 'Campus & Service Times',
      description: 'All campuses, addresses and gathering times in one file.',
      icon: MapPin,
      build: () => [
        'RCI — CAMPUS DIRECTORY',
        '',
        ...content.campuses.flatMap((campus) => [
          `${campus.name} — ${campus.city}, ${campus.country}`,
          `Address: ${campus.address}`,
          `Pastors: ${campus.leadPastors}`,
          `Contact: ${campus.phone} | ${campus.email}`,
          ...campus.serviceTimes.map((service) => `  ${service.day} ${service.time}: ${service.label}`),
          '',
        ]),
      ].join('\n'),
    },
    {
      id: 'giving',
      title: 'Giving & Stewardship Guide',
      description: 'Giving options and banking details for your records.',
      icon: HeartHandshake,
      build: () => [
        'RCI — GIVING & STEWARDSHIP GUIDE',
        '',
        `"Honour the Lord with your substance" — Proverbs 3:9`,
        '',
        `Account name: ${content.bankingDetails.accountName}`,
        `Bank: ${content.bankingDetails.bankName}`,
        `Account number: ${content.bankingDetails.accountNumber}`,
        `Branch code: ${content.bankingDetails.branchCode}`,
        `Physical address: ${content.bankingDetails.physicalAddress}`,
        `Account type: ${content.bankingDetails.accountType}`,
        `SWIFT/BIC: ${content.bankingDetails.swiftCode}`,
        `Reference guide: ${content.bankingDetails.referenceGuide}`,
        '',
        'Email proof of payment to accounts@revivalchurchintl.org for receipting.',
      ].join('\n'),
    },
  ];

  const download = (resource: Resource) => {
    const blob = new Blob([resource.build()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rci-${resource.id}-guide.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setDownloaded((current) => [...current, resource.id]);
    toast(`${resource.title} downloaded.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-950 p-6 text-slate-100 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Free Resources</h3>
            <p className="text-xs text-slate-400">Practical guides for your walk with God.</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-900 hover:text-white">✕</button>
        </div>

        <div className="space-y-3">
          {resources.map((resource) => {
            const Icon = resource.icon;
            const isDone = downloaded.includes(resource.id);
            return (
              <div key={resource.id} className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white">{resource.title}</p>
                  <p className="text-[11px] leading-relaxed text-slate-400">{resource.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => download(resource)}
                  title="Download text file"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-500"
                >
                  {isDone ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                </button>
              </div>
            );
          })}
        </div>
        <p className="mt-5 text-center text-[11px] text-slate-500">Files are generated in your browser — no account required.</p>
      </div>
    </div>
  );
};
