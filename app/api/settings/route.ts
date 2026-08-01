import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_APP_CONFIG } from '@/config/app.config';
import { systemSettingsSchema } from '@/schemas/settings';
import { SettingsRepository } from '@/repositories/settings.repository';
import { Logger } from '@/lib/logger';

export async function GET() {
  // Buscar overrides do banco de dados, se houver
  const dbSettings = await SettingsRepository.getAll();
  const settingsMap: Record<string, string> = {};
  dbSettings.forEach((item) => {
    settingsMap[item.key] = item.value;
  });

  const config = {
    appName: settingsMap['APP_NAME'] || DEFAULT_APP_CONFIG.appName,
    defaultCurrency: settingsMap['DEFAULT_CURRENCY'] || DEFAULT_APP_CONFIG.defaultCurrency,
    defaultTimezone: settingsMap['DEFAULT_TIMEZONE'] || DEFAULT_APP_CONFIG.defaultTimezone,
    defaultLocale: settingsMap['DEFAULT_LOCALE'] || DEFAULT_APP_CONFIG.defaultLocale,
    enableAutomation: settingsMap['ENABLE_AUTOMATION'] !== undefined
      ? settingsMap['ENABLE_AUTOMATION'] === 'true'
      : DEFAULT_APP_CONFIG.enableAutomation,
    operationMode: (settingsMap['OPERATION_MODE'] || DEFAULT_APP_CONFIG.operationMode) as any,
  };

  return NextResponse.json({ success: true, settings: config });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = systemSettingsSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Dados de configuração inválidos',
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Salvar no banco
    await SettingsRepository.upsert('APP_NAME', data.appName, 'string', 'Nome da Operação');
    await SettingsRepository.upsert('DEFAULT_CURRENCY', data.defaultCurrency, 'string', 'Moeda Padrão');
    await SettingsRepository.upsert('DEFAULT_TIMEZONE', data.defaultTimezone, 'string', 'Fuso Horário Padrão');
    await SettingsRepository.upsert('DEFAULT_LOCALE', data.defaultLocale, 'string', 'Idioma/Localização');
    await SettingsRepository.upsert('ENABLE_AUTOMATION', String(data.enableAutomation), 'boolean', 'Habilitação da automação');
    await SettingsRepository.upsert('OPERATION_MODE', data.operationMode, 'string', 'Modo de Operação');

    Logger.info('SETTINGS', 'UPDATE', 'Configurações do sistema atualizadas com sucesso.', data as any);

    return NextResponse.json({
      success: true,
      message: 'Configurações atualizadas com sucesso',
      settings: data,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao salvar configurações',
      },
      { status: 500 }
    );
  }
}
