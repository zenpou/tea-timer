import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { TeaPreset } from "../types";
import "./PresetEditor.css";

interface Props {
  presets: TeaPreset[];
  defaultPresetId: string;
  onSave: (presets: TeaPreset[], defaultPresetId: string) => void;
  onClose: () => void;
}

interface EditForm {
  nameJa: string;
  nameEn: string;
  fixedTimes: string;
  increment: string;
}

function presetToForm(preset: TeaPreset): EditForm {
  return {
    nameJa: preset.name.ja,
    nameEn: preset.name.en,
    fixedTimes: preset.fixedTimes.join(", "),
    increment: String(preset.increment),
  };
}

function generateId(): string {
  return `custom-${Date.now()}`;
}

export function PresetEditor({ presets, defaultPresetId, onSave, onClose }: Props) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "ja" | "en";
  const [list, setList] = useState<TeaPreset[]>([...presets]);
  const [defaultId, setDefaultId] = useState(defaultPresetId);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EditForm>({
    nameJa: "",
    nameEn: "",
    fixedTimes: "",
    increment: "",
  });

  const handleEdit = (preset: TeaPreset) => {
    setEditingId(preset.id);
    setForm(presetToForm(preset));
  };

  const handleAdd = () => {
    const newId = generateId();
    setEditingId(newId);
    setForm({ nameJa: "", nameEn: "", fixedTimes: "60", increment: "10" });
  };

  const handleDelete = (id: string) => {
    if (id === defaultId) return;
    setList((prev) => prev.filter((p) => p.id !== id));
    if (editingId === id) {
      setEditingId(null);
    }
  };

  const handleFormSave = () => {
    if (!editingId || !form.nameJa.trim()) return;

    const fixedTimes = form.fixedTimes
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n >= 0);

    if (fixedTimes.length === 0) return;

    const increment = Math.max(0, parseInt(form.increment, 10) || 0);

    const preset: TeaPreset = {
      id: editingId,
      name: {
        ja: form.nameJa.trim(),
        en: form.nameEn.trim() || form.nameJa.trim(),
      },
      fixedTimes,
      increment,
    };

    setList((prev) => {
      const idx = prev.findIndex((p) => p.id === editingId);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = preset;
        return updated;
      }
      return [...prev, preset];
    });
    setEditingId(null);
  };

  const handleSaveAll = () => {
    onSave(list, defaultId);
  };

  return (
    <div className="preset-editor">
      <div className="preset-editor-header">
        <h2>{t("preset.title")}</h2>
        <button className="preset-add-btn" onClick={handleAdd}>
          + {t("preset.add")}
        </button>
      </div>

      <div className="preset-list">
        {list.map((preset) => (
          <div
            key={preset.id}
            className={`preset-item ${editingId === preset.id ? "editing" : ""}`}
          >
            <span className="preset-item-name">
              {preset.name[lang]}
              {preset.id === defaultId && (
                <span className="preset-default-badge">{t("preset.default")}</span>
              )}
            </span>
            <span className="preset-item-info">
              [{preset.fixedTimes.join(", ")}s] +{preset.increment}s
            </span>
            <div className="preset-item-actions">
              {preset.id !== defaultId && (
                <button onClick={() => setDefaultId(preset.id)}>
                  {t("preset.setDefault")}
                </button>
              )}
              <button onClick={() => handleEdit(preset)}>
                {t("preset.edit")}
              </button>
              <button
                onClick={() => handleDelete(preset.id)}
                disabled={preset.id === defaultId}
              >
                {t("preset.delete")}
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingId && (
        <div className="preset-form">
          <label>
            {t("preset.name")} (日本語)
            <input
              type="text"
              value={form.nameJa}
              onChange={(e) => setForm({ ...form, nameJa: e.target.value })}
            />
          </label>
          <label>
            {t("preset.name")} (English)
            <input
              type="text"
              value={form.nameEn}
              onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
            />
          </label>
          <label>
            {t("preset.fixedTimes")}
            <input
              type="text"
              value={form.fixedTimes}
              onChange={(e) => setForm({ ...form, fixedTimes: e.target.value })}
              placeholder="60, 10"
            />
          </label>
          <label>
            {t("preset.increment")}
            <input
              type="number"
              value={form.increment}
              onChange={(e) => setForm({ ...form, increment: e.target.value })}
              min={0}
            />
          </label>
          <div className="preset-form-actions">
            <button onClick={handleFormSave}>{t("preset.save")}</button>
            <button onClick={() => setEditingId(null)}>
              {t("preset.cancel")}
            </button>
          </div>
        </div>
      )}

      <div className="preset-editor-footer">
        <button className="save-all-btn" onClick={handleSaveAll}>
          {t("preset.save")}
        </button>
        <button onClick={onClose}>{t("preset.cancel")}</button>
      </div>
    </div>
  );
}
