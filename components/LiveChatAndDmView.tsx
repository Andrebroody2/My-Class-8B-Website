'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Send,
  MessageSquare,
  Mail,
  Trash2,
  Shield,
  Radio,
} from 'lucide-react';
import { ClassRole, ROLE_METADATA } from '@/lib/class8b-logic';
import { BannerArtwork, TitleInsignia } from './BannerArtwork';

export interface GroupChatMessage {
  id: string;
  senderUsername: string;
  senderName: string;
  senderRole: ClassRole;
  senderBanner: string;
  senderTitle: string;
  text: string;
  timeLabel: string;
}

export interface DirectMessageItem {
  id: string;
  senderUsername: string;
  senderName: string;
  recipientUsername: string;
  recipientName: string;
  text: string;
  timeLabel: string;
}

interface LiveChatAndDmViewProps {
  currentUser: {
    username: string;
    displayName: string;
    role: ClassRole;
    equippedBanner: string;
    equippedTitle: string;
  };
  groupMessages: GroupChatMessage[];
  onSendGroupMessage: (text: string) => void;
  onDeleteGroupMessage: (id: string) => void;
  directMessages: DirectMessageItem[];
  onSendDirectMessage: (recipientUsername: string, recipientName: string, text: string) => void;
  quietClassHoursActive: boolean;
}

export function LiveChatAndDmView({
  currentUser,
  groupMessages,
  onSendGroupMessage,
  onDeleteGroupMessage,
  directMessages,
  onSendDirectMessage,
  quietClassHoursActive,
}: LiveChatAndDmViewProps) {
  const [subTab, setSubTab] = useState<'group' | 'dm'>('group');
  const [groupInput, setGroupInput] = useState('');
  const [dmRecipientUser, setDmRecipientUser] = useState('buaida');
  const [dmRecipientName, setDmRecipientName] = useState('Ibu Aida (Wali Kelas 8B)');
  const [dmText, setDmText] = useState('');

  const canModerate = currentUser.role === 'owner' || currentUser.role === 'teacher';

  const handleGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupInput.trim()) return;
    onSendGroupMessage(groupInput.trim());
    setGroupInput('');
  };

  const handleDmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dmText.trim() || !dmRecipientUser.trim()) return;
    onSendDirectMessage(
      dmRecipientUser.trim().toLowerCase(),
      dmRecipientName.trim() || dmRecipientUser.trim(),
      dmText.trim()
    );
    setDmText('');
  };

  const quickContacts = [
    { username: 'buaida', name: 'Ibu Aida (Wali Kelas 8B)' },
    { username: 'owner8b', name: 'Owner Web Kelas 8B' },
    { username: 'ketua8b', name: 'Ketua Kelas 8B' },
    { username: 'wakil8b', name: 'Wakil Ketua 8B' },
    { username: 'sekretaris1', name: 'Sekretaris 1 (8B)' },
    { username: 'bendahara1', name: 'Bendahara 1 (8B)' },
  ];

  const myDirectMessages = directMessages.filter(
    (m) =>
      m.senderUsername === currentUser.username ||
      m.recipientUsername === currentUser.username ||
      canModerate
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <Radio className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>Transmisi Real-Time 24/7 Kelas 8B SMPN 18 Kota Bogor · Tanpa Delay</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Pusat Komunikasi &amp; Pesan Pribadi Kelas 8B
          </h1>
        </div>

        <div className="flex items-center gap-1 rounded-2xl bg-slate-200/75 p-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setSubTab('group')}
            className={`relative min-h-[44px] inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              subTab === 'group' ? 'text-white' : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            {subTab === 'group' && (
              <motion.span
                layoutId="chatSubTab"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className="absolute inset-0 rounded-xl bg-slate-900"
              />
            )}
            <MessageSquare className="relative z-10 h-3.5 w-3.5" />
            <span className="relative z-10">Live Group Chat 24/7 ({groupMessages.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab('dm')}
            className={`relative min-h-[44px] inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              subTab === 'dm' ? 'text-white' : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            {subTab === 'dm' && (
              <motion.span
                layoutId="chatSubTab"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className="absolute inset-0 rounded-xl bg-slate-900"
              />
            )}
            <Mail className="relative z-10 h-3.5 w-3.5" />
            <span className="relative z-10">Pesan Pribadi / DM ({myDirectMessages.length})</span>
          </button>
        </div>
      </div>

      {quietClassHoursActive && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-900">
          Mode Jam Pelajaran Aktif: Mohon gunakan ruang diskusi khusus untuk tanya-jawab materi
          pelajaran dan koordinasi tugas Kelas 8B.
        </div>
      )}

      {subTab === 'group' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 flex flex-col rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="border-b border-slate-200 bg-slate-950 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-white">
                  Ruang Diskusi Utama Kelas 8B — Live 24/7
                </div>
                <div className="text-xs text-slate-300">
                  Setiap pesan menampilkan Banner &amp; Gelar Eksklusif pengirim secara real-time
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                LIVE 24/7
              </span>
            </div>

            <div className="p-5 space-y-4 max-h-[520px] overflow-y-auto">
              {groupMessages.map((msg, idx) => {
                const isMe = msg.senderUsername === currentUser.username;
                const roleLabel = ROLE_METADATA[msg.senderRole]?.shortLabel || 'Siswa 8B';
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ y: 8 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.18, delay: Math.min(idx * 0.02, 0.1) }}
                    className={`rounded-2xl border p-4 space-y-2.5 ${
                      isMe
                        ? 'border-slate-900 bg-slate-50/90'
                        : 'border-slate-200/90 bg-white'
                    }`}
                  >
                    <BannerArtwork
                      bannerId={msg.senderBanner || 'banner_default'}
                      compact
                      className="h-14 w-full rounded-xl"
                    >
                      <div className="flex items-center justify-between gap-2 text-white">
                        <div className="flex flex-wrap items-center gap-2 min-w-0">
                          <span className="font-bold text-xs truncate">{msg.senderName}</span>
                          <span className="text-slate-300 text-xs" aria-hidden="true">
                            ·
                          </span>
                          <span className="text-xs text-amber-200 font-medium">{roleLabel}</span>
                          <span
                            className="text-slate-300 text-xs hidden sm:inline"
                            aria-hidden="true"
                          >
                            ·
                          </span>
                          <span className="hidden sm:inline">
                            <TitleInsignia titleId={msg.senderTitle || 'title_default'} size="sm" />
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono text-xs text-slate-200 tabular-nums">
                            {msg.timeLabel}
                          </span>
                          {(isMe || canModerate) && (
                            <button
                              type="button"
                              onClick={() => onDeleteGroupMessage(msg.id)}
                              aria-label={`Hapus pesan dari ${msg.senderName}`}
                              className="text-slate-300 hover:text-red-300 transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </BannerArtwork>

                    <p className="text-sm text-slate-800 leading-relaxed pl-1">{msg.text}</p>
                  </motion.div>
                );
              })}
            </div>

            <form
              onSubmit={handleGroupSubmit}
              className="border-t border-slate-200 bg-slate-50 p-4 flex items-center gap-3"
            >
              <input
                type="text"
                aria-label="Ketik pesan ke Group Chat 24/7 Kelas 8B"
                value={groupInput}
                onChange={(e) => setGroupInput(e.target.value)}
                placeholder="Ketik pesan ke seluruh teman Kelas 8B (Enter untuk kirim cepat)..."
                maxLength={1000}
                className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Kirim Live</span>
              </motion.button>
            </form>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
              <div className="text-xs font-bold text-slate-500">
                Pratinjau Identitas Chat Kamu
              </div>
              <BannerArtwork
                bannerId={currentUser.equippedBanner}
                compact
                className="h-16 w-full rounded-2xl"
              >
                <div className="flex flex-col justify-center h-full text-white">
                  <div className="font-bold text-xs">{currentUser.displayName}</div>
                  <div className="mt-0.5">
                    <TitleInsignia titleId={currentUser.equippedTitle} size="sm" />
                  </div>
                </div>
              </BannerArtwork>
              <p className="text-xs text-slate-600 leading-relaxed">
                Banner dan Gelar di atas otomatis tampil setiap kali kamu mengirim pesan di Live
                Group Chat 24/7 Kelas 8B.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-2.5 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Shield className="h-4 w-4 text-slate-700" />
                <span>Tata Tertib Ruang Diskusi 8B</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                1. Gunakan bahasa Indonesia yang santun dan saling menghormati sesama teman 8B.
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                2. Dilarang membagikan Kode Verifikasi Kelas kepada pihak di luar Kelas 8B SMPN 18
                Kota Bogor.
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                3. Ibu Aida dan Owner memiliki akses moderasi penuh 24/7.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Tab Pesan Pribadi (Private Messaging / DM) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={handleDmSubmit}
            className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-6 space-y-4 self-start shadow-xs"
          >
            <div>
              <div className="text-xs font-semibold text-indigo-600">
                Jalur Pesan Terenkripsi Antar Warga 8B
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Kirim Pesan Pribadi (Private Message)
              </h2>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-700">
                Pilih Kontak Cepat Pengurus / Wali Kelas (atau ketik manual di bawah):
              </div>
              <div className="flex flex-wrap gap-1.5">
                {quickContacts.map((c) => (
                  <button
                    key={c.username}
                    type="button"
                    onClick={() => {
                      setDmRecipientUser(c.username);
                      setDmRecipientName(c.name);
                    }}
                    className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                      dmRecipientUser === c.username
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="dm-user" className="block text-xs font-semibold text-slate-700 mb-1">
                  Username Tujuan
                </label>
                <input
                  id="dm-user"
                  type="text"
                  value={dmRecipientUser}
                  onChange={(e) => setDmRecipientUser(e.target.value)}
                  placeholder="Contoh: buaida / rizky8b"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
                />
              </div>
              <div>
                <label htmlFor="dm-name" className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Penerima
                </label>
                <input
                  id="dm-name"
                  type="text"
                  value={dmRecipientName}
                  onChange={(e) => setDmRecipientName(e.target.value)}
                  placeholder="Nama teman sekelas..."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900"
                />
              </div>
            </div>

            <div>
              <label htmlFor="dm-text" className="block text-xs font-semibold text-slate-700 mb-1">
                Isi Pesan Pribadi
              </label>
              <textarea
                id="dm-text"
                rows={3}
                value={dmText}
                onChange={(e) => setDmText(e.target.value)}
                placeholder="Tulis pesan pribadi untuk teman sekelas, pengurus, atau Bu Aida..."
                maxLength={1000}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900"
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Kirim Pesan Pribadi</span>
            </motion.button>
          </form>

          <div className="lg:col-span-7 space-y-3">
            <div className="text-sm font-bold text-slate-900">
              Kotak Masuk &amp; Pesan Terkirim ({myDirectMessages.length})
            </div>
            {myDirectMessages.map((dm) => {
              const isSentByMe = dm.senderUsername === currentUser.username;
              return (
                <motion.article
                  key={dm.id}
                  whileHover={{ y: -2 }}
                  className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-bold text-slate-900">
                        {isSentByMe ? `Kepada: ${dm.recipientName}` : `Dari: ${dm.senderName}`}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {isSentByMe
                          ? `Pengirim: Anda (${dm.senderName})`
                          : `Untuk: ${dm.recipientName}`}
                      </span>
                    </div>
                    <span className="font-mono tabular-nums">{dm.timeLabel}</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{dm.text}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
