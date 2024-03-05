export class RequestReportDto {
  constructor(
    private readonly reportType: string,
    private readonly requestedBy: string,
  ) {}
}
