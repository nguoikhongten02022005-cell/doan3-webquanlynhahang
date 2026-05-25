---
name: mcp-usage-guide
description: Use when deciding which MCP tool to read code, inspect git, check GitHub, query MySQL, test UI, or fetch docs for this repo.
type: reference
---

# 01 MCP Usage Guide

## filesystem MCP
Dung khi:
- doc file trong repo
- tim file / tree / read / write skill file
- can context code chinh xac

Checklist:
- list directory
- read file target
- read related files
- chi write trong `.skills/` khi task nay

## git MCP
Dung khi:
- xem status
- xem diff
- xem history
- can biet branch state

Checklist:
- status
- diff staged/unstaged
- log
- khong commit, khong reset, khong checkout destructive

## github MCP
Dung khi:
- doc issue / PR / remote branch
- can xem context repo tren GitHub

Checklist:
- read issue/PR
- inspect file remote neu can
- khong post comment / create PR neu chua duoc yeu cau

## mysql MCP
Dung khi:
- kiem tra schema that
- doi chieu du lieu mau
- xac minh view / index / FK / count

Safe only:
- `SHOW TABLES`
- `DESCRIBE` / `SHOW CREATE`
- `SELECT`
- `COUNT(*)`
- `EXPLAIN`

Cấm:
- `INSERT`
- `UPDATE`
- `DELETE`
- `DROP`
- `ALTER`
- `TRUNCATE`

## playwright MCP
Dung khi:
- test UI
- quan sat luong khach / noi bo
- verify routing, form, state, modal, table, chart

Checklist:
- mo dung URL local
- quan sat snapshot truoc
- click/typing co muc dich
- doc console/network neu loi
- khong thay doi du lieu quan trong neu chua hoi

## fetch MCP
Dung khi:
- doc URL public / docs / guide / spec ngoai repo
- can link tai lieu

Khong dung cho:
- GitHub content da co tool chuyen dung
- private/authenticated page neu khong co access

## context7 MCP
Dung khi:
- can doc chinh xac thu vien/framework/CLI/API
- React / Vite / NestJS / Ant Design / React Router / MySQL driver / Swagger

Uu tien khi:
- nghi syntax doi version
- can best practice moi nhat
- can config hoac migration guide

## Uu tien khi debug
1. filesystem
2. git diff / log
3. context7 neu lien quan thu vien
4. mysql neu can doi chieu data
5. playwright neu loi UI

## Uu tien khi kiem tra DB
1. read schema / init SQL
2. mysql DESCRIBE / SHOW / SELECT
3. doi chieu service/service query

## Uu tien khi test giao dien
1. build/run FE
2. playwright snapshot
3. browser console/network
4. FE service file + route mapping

## Thao tac MCP bi cam neu chua duoc user cho phep
- sua code nghiep vu
- sua DB
- commit / push / PR / comment GitHub
- xoa file / reset / force
- deploy / publish / send thong diep ngoai repo
