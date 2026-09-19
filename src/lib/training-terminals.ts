import type { TerminalLine } from "../components/diagrams/types";

/**
 * Looping terminal sessions shown in the hero of a training page - a taste of what
 * participants type during the workshop. Keyed by training slug; keep each script
 * short (it has to fit one 12s loop) and highlight at most one value per line.
 */
const terminals: Record<string, TerminalLine[]> = {
  docker: [
    { cmd: "docker build -t api:1.4.2 ." },
    { out: "=> [build 4/6] RUN go build -o /app" },
    { out: "=> exporting to image          12.4MB", hl: "12.4MB" },
    { cmd: "docker compose up -d" },
    { out: "✔ Container db    Healthy" },
    { out: "✔ Container api   Started", hl: "Started" },
  ],
  kubernetes: [
    { cmd: "kubectl apply -f deployment.yaml" },
    { out: "deployment.apps/api configured" },
    { cmd: "kubectl rollout status deploy/api" },
    { out: "Waiting for rollout: 2 of 3 updated…" },
    { out: 'deployment "api" successfully rolled out', hl: "successfully rolled out" },
  ],
  "argo-cd": [
    { cmd: "git push origin main" },
    { out: "a1f9c..7be21  main -> main" },
    { cmd: "argocd app get api" },
    { out: "Sync Status:    Synced to main (7be21)", hl: "Synced" },
    { out: "Health Status:  Healthy" },
  ],
  terraform: [
    { cmd: "terraform plan" },
    { out: "  # aws_eks_node_group.workers will be updated" },
    { out: "  ~ desired_size = 3 -> 5", hl: "3 -> 5" },
    { out: "Plan: 0 to add, 1 to change, 0 to destroy." },
    { cmd: "terraform apply -auto-approve" },
    { out: "Apply complete! Resources: 1 changed.", hl: "Apply complete!" },
  ],
  git: [
    { cmd: "git switch -c feature/login" },
    { out: "Switched to a new branch 'feature/login'" },
    { cmd: "git rebase main" },
    { out: "Successfully rebased and updated", hl: "Successfully rebased" },
    { cmd: "git log --oneline -2" },
    { out: "7be21c4 feat: add login form" },
    { out: "a1f9c02 chore: bump deps" },
  ],
  "github-actions": [
    { cmd: "gh workflow run ci.yml" },
    { out: "✓ Created workflow_dispatch event" },
    { cmd: "gh run watch" },
    { out: "✓ test      1m12s" },
    { out: "✓ build     48s" },
    { out: "✓ deploy    31s   production", hl: "production" },
  ],
  "gitlab-ci": [
    { cmd: "git push origin main" },
    { out: "a1f9c..7be21  main -> main" },
    { cmd: "glab ci status" },
    { out: "(success) • 01m 12s  test" },
    { out: "(success) • 00m 48s  build" },
    { out: "(running) • 00m 09s  deploy", hl: "running" },
  ],
  "postgres-on-k8s": [
    { cmd: "kubectl cnpg status pg-main" },
    { out: "Instances:        3" },
    { out: "Ready instances:  3", hl: "3" },
    { out: "Primary:          pg-main-1" },
    { cmd: "kubectl cnpg promote pg-main pg-main-2" },
    { out: "Failover completed in 4s", hl: "4s" },
  ],
  "grafana-stack": [
    { cmd: 'logcli query \'{app="api"} |= "error"\'' },
    { out: "2 streams, 14 lines" },
    { cmd: "promtool query instant :9090 'up{job=\"api\"}'" },
    { out: 'up{job="api", pod="api-0"} => 1', hl: "1" },
    { out: 'up{job="api", pod="api-1"} => 1', hl: "1" },
  ],
  otel: [
    { cmd: "otel-cli exec --name deploy ./deploy.sh" },
    { out: "trace_id: 4bf92f3577b34da6a3ce929d0e0e4736" },
    { cmd: "kubectl logs deploy/otel-collector" },
    { out: "TracesExporter  spans: 128", hl: "128" },
    { out: "MetricsExporter metrics: 42" },
  ],
  "feature-flags": [
    { cmd: "flagd start -f flags.json" },
    { out: "flag evaluation gRPC on :8013" },
    { cmd: "curl -s :8013/flags/new-checkout" },
    { out: '{ "value": true, "variant": "on" }', hl: "true" },
  ],
};

const fallback: TerminalLine[] = [
  { cmd: "kubectl get pods" },
  { out: "NAME      READY   STATUS" },
  { out: "api-0     1/1     Running", hl: "Running" },
  { out: "api-1     1/1     Running", hl: "Running" },
];

export function getTrainingTerminal(slug: string): TerminalLine[] {
  return terminals[slug] ?? fallback;
}
